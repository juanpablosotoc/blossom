import os
import asyncio
import re
import execjs
from lxml import etree as ET  # you already import this later
from myExceptions.service import ServiceError
from myAws import S3
from uuid import uuid4
from .handle_tags import handleVideoTag, handleAudioTag  # unchanged
from ..config import Config
from .pipeline import pipeline

# Semaphore to avoid hammering openai/other apis
sem = asyncio.Semaphore(4)
async def _guarded(coro):
    async with sem:
        return await coro

# --------------------------------
# Main transformer (entrypoint)
# --------------------------------
async def transform_gutenberg(content: str) -> str:
    """
    Transforms Gutenberg content by escaping special characters, handling
    <Code> blocks, and returning the modified content as a string.
    """
    if not content: return ""

    # Process the content using the pipeline
    cleaned_content = pipeline(content)

    #########################################################
    # Process cleaned xml
    #########################################################
    try:
        root = ET.fromstring(cleaned_content)
    except ET.XMLSyntaxError as e:
        print(f"XMLSyntaxError in transform_gutenberg: {e}")
        
        # Store the content in s3 to analyze xml that led to the error
        error_name = f"xml_error_{uuid4()}.xml"
        # Save the xml to a file
        with open(error_name, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        S3.upload_file(
            bucket_name=Config.AWS_BUCKET_NAME,
            object_name=error_name,
            file_path=error_name,
        )
        # remove the file
        os.remove(error_name)

        raise ServiceError("Failed to parse the XML content")

    # ---------------------------
    # CONCURRENT Video/Audio pass
    # ---------------------------
    # 1) Collect all target elements (keep references and tag name)
    targets: list[tuple[str, ET._Element]] = []
    for tag_name in ("Video", "Audio"):
        for el in root.findall(f".//{tag_name}"):
            targets.append((tag_name, el))

    # 2) Prepare all async tasks without mutating the tree yet
    #    We snapshot the element's XML string at this moment
    tasks = []
    for tag_name, el in targets:
        el_xml = ET.tostring(el, encoding="unicode", method="xml")
        if tag_name == "Video":
            tasks.append(_guarded(handleVideoTag(el_xml)))
        else:  # "Audio"
            tasks.append(_guarded(handleAudioTag(el_xml)))

    # 3) Run all transforms concurrently
    try:
        results = await asyncio.gather(*tasks, return_exceptions=False)
    except Exception as e:
        # Surface a clear error if any handler fails
        raise ServiceError(f"Failed processing media tags concurrently: {e}") from e

    # 4) Apply replacements after all are done
    #    Each result is (transformed_element_xml: str, new_file_ids: list[str])
    file_ids: list[str] = []
    for (tag_name, old_el), (new_xml, new_ids) in zip(targets, results):
        file_ids.extend(new_ids or [])
        try:
            new_el = ET.fromstring(new_xml)
        except ET.XMLSyntaxError as e:
            # If handler produced invalid XML, fail gracefully with context
            raise ServiceError(f"Handler for <{tag_name}> returned invalid XML: {e}") from e
        parent = old_el.getparent()
        if parent is None:
            # Shouldn't happen for normal content, but guard anyway
            continue
        parent.replace(old_el, new_el)

    # Convert the modified root element back to a string
    transformed_content = ET.tostring(root, encoding="unicode", method="xml")

    # Remove the wrapping <root> element before returning
    transformed_content = re.sub(r"^<root>|</root>$", "", transformed_content)

    # Add fragment back to the JSX
    transformed_content = f"<>\n{transformed_content}\n</>"

    return transformed_content, file_ids
