from .processing import BasicProcessing, TagSpecificProcessing


def pipeline(s: str) -> str:
    # basic, tag-safe normalization
    s = BasicProcessing(s).process()
    # tag-specific (Code blocks, etc.)
    s = TagSpecificProcessing(s).process()
    # wrap for lxml
    return f"<root>{s}</root>"
