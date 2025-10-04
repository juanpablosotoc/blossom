import os
import re
import execjs
from lxml import etree as ET  # you already import this later
from myExceptions.service import ServiceError
from .handle_tags import handleVideoTag, handleAudioTag  # unchanged

# ----------------------------
# Helpers for “safe” JS parsing
# ----------------------------
_VALID_JS_ESCAPE_AFTER_BACKSLASH = r"[0-7xuXbfnrtv\\'\"`]" 

_JS_CTX = None

def escape_inner_quotes_in_attrs(s: str) -> str:
    """
    Inside tags, convert *inner* double quotes within an attribute value to &quot;,
    while preserving the delimiter quote that ends the attribute.

    Example:
      <Math expression="θ¨ + (g/L) θ="0""></Math>
      -> <Math expression="θ¨ + (g/L) θ=&quot;0&quot;"></Math>

    Assumptions:
      - Attributes are double-quoted after your normalizers (preferred).
      - We only handle double-quoted values (most common case).
    """
    out = []
    i = 0
    n = len(s)

    in_tag = False
    in_dq_attr = False  # currently inside a "..." attribute value

    while i < n:
        ch = s[i]

        if not in_tag:
            if ch == "<":
                in_tag = True
            out.append(ch)
            i += 1
            continue

        # in_tag == True here
        if not in_dq_attr:
            out.append(ch)
            if ch == ">":
                in_tag = False
            elif ch == '"':
                # stray quote (rare), treat as entering attr anyway
                in_dq_attr = True
            elif ch == "=":
                # look ahead: if next non-space is a double quote, start attr
                j = i + 1
                while j < n and s[j].isspace():
                    j += 1
                if j < n and s[j] == '"':
                    # copy up to the quote (we already copied '='), then enter attr
                    i = j
                    out.append('"')
                    in_dq_attr = True
                i += 1
                continue
            i += 1
            continue
        else:
            # inside a double-quoted attribute value
            if ch == '"':
                # Heuristic: if this quote is followed by a tag/attr boundary,
                # treat it as the *closing* quote; otherwise it's an inner quote to escape.
                nxt = s[i + 1] if i + 1 < n else ""
                if nxt in (" ", ">", "/") or nxt == "":
                    # end of attr value
                    out.append('"')
                    in_dq_attr = False
                else:
                    # inner quote → escape
                    out.append("&quot;")
                i += 1
                continue
            else:
                out.append(ch)
                i += 1
                continue

    return "".join(out)

def _sanitize_for_js_parser(s: str) -> str:
    if not s:
        return s
    # Any backslash NOT followed by a valid escape starter becomes double backslash
    return re.sub(rf"\\(?!{_VALID_JS_ESCAPE_AFTER_BACKSLASH})", r"\\\\", s)

def _load_js_ctx() -> execjs.ExternalRuntime.Context:
    global _JS_CTX
    if _JS_CTX is None:
        js_path = os.path.join(os.getcwd(), "process_jsx.js")
        with open(js_path, "r", encoding="utf-8") as f:
            js_code = f.read()
        _JS_CTX = execjs.compile(js_code)
    return _JS_CTX

def normalize_all_attrs(s: str) -> str:
    """
    Normalize attributes inside tags so lxml won't choke:
      - attr={...}   -> attr="... "   (inner double-quotes become &quot;)
      - attr=value   -> attr="value"  (bare/unquoted -> quoted)
      - attr="value" -> unchanged
      - attr='value' -> unchanged (or convert if you prefer)
    Boolean attributes (no '=') are left as-is.
    """

    if not s: return s

    # 1) JSX brace values: attr={ ... }  --> attr=" ... "
    #    Non-greedy capture of inner; doesn't cross tag boundaries
    brace_pattern = re.compile(r'(\s[\w:-]+)\s*=\s*\{\s*([^{}]*?)\s*\}')
    def _brace_sub(m: re.Match) -> str:
        name = m.group(1)
        inner = m.group(2).strip()
        # Make double-quotes XML-safe
        inner = inner.replace('"', '&quot;')
        return f'{name}="{inner}"'
    s = brace_pattern.sub(_brace_sub, s)

    # 2) Bare/unquoted values: attr=value  --> attr="value"
    #    Avoid touching:
    #      - already double-quoted values: attr="..."
    #      - already single-quoted values: attr='...'
    #      - brace values (handled above)
    #    Value ends at whitespace, '>', '/', or end-of-tag.
    bare_pattern = re.compile(
        r'(\s[\w:-]+)\s*=\s*(?!")'    # not starting with "
        r'(?!\')'                     # not starting with '
        r'(?!\{)'                     # not starting with {
        r'([^\s"\'{}>/]+)'            # the bare value
    )
    s = bare_pattern.sub(lambda m: f'{m.group(1)}="{m.group(2)}"', s)

    return s

def escape_jsx(content: str) -> str:
    """
    Call processJSX from process_jsx.js with parser-sanitized input.
    If Babel fails, fall back to a minimal safe escaping (no raise).
    """
    try:
        ctx = _load_js_ctx()
        safe = _sanitize_for_js_parser(content or "")
        return ctx.call("processJSX", safe)
    except Exception as e:
        # Last-resort “don’t crash” fallback: neutralize template/backticks
        try:
            return (content or "") \
                .replace("\\", "\\\\") \
                .replace("`", "\\`") \
                .replace("${", "\\${")
        except Exception:
            raise ServiceError(f"Failed to escape JSX\n{e}") from e

# ----------------------------
# XML text sanitizer
# ----------------------------
# Recognize legitimate tag/comment/PI starts so we don't escape those '<'
_TAG_START = r'(?:/?[A-Za-z][A-Za-z0-9:_-]*\b|!--|\?xml)'

def escape_for_xml_text(s: str) -> str:
    """
    Escapes characters that would break XML parsing *when they occur in text*,
    while leaving real tags/entities intact.

    - Escapes any '&' that isn't already an entity (e.g., '&amp;', '&#123;')
    - Escapes any '<' that doesn't begin a valid tag/comment/PI
    """
    if not s:
        return s

    # 1) Escape stray ampersands first (to avoid double-escaping valid entities)
    s = re.sub(r'&(?![A-Za-z#][A-Za-z0-9]*;)', '&amp;', s)

    # 2) Escape '<' that do not introduce a tag, comment, or processing instruction
    s = re.sub(rf'<(?!{_TAG_START})', '&lt;', s)

    return s

# --------------------------------
# Main transformer (entrypoint)
# --------------------------------
async def transform_gutenberg(content: str) -> str:
    """
    Transforms Gutenberg content by escaping special characters, handling
    <Code> blocks, and returning the modified content as a string.
    """
    if content is None:
        content = ""

    # Trim outer whitespace
    content = content.strip()

    # Ensure wrapped in a fragment (use real newlines)
    if not (content.startswith("<>") and content.rstrip().endswith("</>")):
        content = f"<>\n{content}\n</>"

    # Escape `${...}` template insertions to avoid evaluation inside backticks later
    content = re.sub(r"\$\{([^}]+)\}", r"\\${\1}", content)

    # Escape backticks (backticks will be used inside Code fences)
    content = content.replace("`", r"\`")

    # Escape comparison operators that can confuse some parsers when used in text
    content = content.replace("<=", "&lt;=").replace(">=", "&gt;=")

    # ------- Code block handling -------
    # Match <Code language=...> where the value may be quoted or unquoted, with arbitrary spaces/casing.
    # Examples matched:
    #   <Code language="python">
    #   <Code   language = 'js'  >
    #   <code LANGUAGE=tsx>
    code_open_re = re.compile(
        r"<\s*Code\s+language\s*=\s*(?P<quote>['\"]?)(?P<lang>[^'\"\s>]+)(?P=quote)\s*>",
        flags=re.IGNORECASE,
    )
    # Replace opening tag to start code fence with {`
    def _open_code_sub(m: re.Match) -> str:
        lang = m.group("lang")
        return f"<Code language={lang}>\n{{`"

    content = code_open_re.sub(_open_code_sub, content)

    # Closing tag: insert `} before </Code>, tolerant to spaces/casing
    content = re.sub(r"<\s*/\s*Code\s*>", "`}\n</Code>", content, flags=re.IGNORECASE)

    # Final pass: escape via JS helper (Babel) with sanitization & fallbacks
    content = escape_jsx(content)

    # quote the style attribute
    content = normalize_all_attrs(content)
    content = escape_inner_quotes_in_attrs(content)

    # Remove the JSX fragments (both compact and spaced versions)
    content = content.replace("<>", "").replace("</>", "")
    content = content.replace("< >", "").replace("</ >", "")

    # BEFORE handing to lxml: escape raw text '<' / stray '&' not belonging to tags
    content = escape_for_xml_text(content)

    # Build a synthetic root so lxml can parse multiple top-level nodes
    wrapped_content = f"<root>{content}</root>"

    # dump to dummy file
    with open('dummy.xml', 'w', encoding='utf-8') as f:
        f.write(wrapped_content)

    try:
        root = ET.fromstring(wrapped_content)
    except ET.XMLSyntaxError as e:
        print(f"XMLSyntaxError in transform_gutenberg: {e}")
        raise ServiceError("Failed to parse the XML content")
    
    file_ids = []
    
    for tag_name in ['Video', 'Audio']:
        for element in root.findall(f'.//{tag_name}'):
            element_string = ET.tostring(element, encoding='unicode', method='xml')
            if tag_name == 'Video':
                transformed_element, new_file_ids = await handleVideoTag(element_string)
                file_ids = [*file_ids, *new_file_ids]
            elif tag_name == 'Audio':
                transformed_element, new_file_ids = await handleAudioTag(element_string)
                file_ids = [*file_ids, *new_file_ids]
            # Convert the transformed element back to XML and replace the original
            new_element = ET.fromstring(transformed_element)
            parent = element.getparent()
            parent.replace(element, new_element)
    
    # Convert the modified root element back to a string
    transformed_content = ET.tostring(root, encoding='unicode', method='xml')
    
    # Remove the wrapping <root> element before returning
    transformed_content = re.sub(r'^<root>|</root>$', '', transformed_content)
    
    # add fragment to the jsx
    transformed_content = f'<>\n{transformed_content}\n</>'

    return transformed_content, file_ids
