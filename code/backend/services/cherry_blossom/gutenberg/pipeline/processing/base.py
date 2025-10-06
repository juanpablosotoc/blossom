import re
import xml.etree.ElementTree as ET

# Whole-line “tag-like” detector (start/end/self, comment, PI, CDATA)
_TAG_LINE_RE = re.compile(
    r"""^\s*
        <
        (?:
            /?[A-Za-z][\w:\-\.]*      # <tag or </tag
            (?:\s+[^<>]*?)?           # attrs
            /?                        # optional self-close
          | !--.*?--                  # comment
          | \?.*?\?                   # processing instruction
          | !\[CDATA\[.*?\]\]         # CDATA
        )
        >
        \s*$
    """,
    re.VERBOSE | re.DOTALL,
)

# last closing tag on the line: </tagName   >
_CLOSE_TAG_RE = re.compile(
    r'</\s*(?![!?])([A-Za-z][\w.\-:]*)\s*>'
)

# any tag start (opening or self-closing): <tagName ...> or <tagName/>
_OPEN_OR_ANY_TAG_RE = re.compile(
    r'<\s*/?\s*(?![!?])([A-Za-z][\w.\-:]*)\b'
)

# Opening or self-closing tag regex (not closing, not comment/PI)
_OPEN_TAG_RE = re.compile(
    r'<\s*(?!/)(?![!?])([A-Za-z][\w.\-:]*)\b[^>]*?>'
)

class Processing:
    def __init__(self, s: str):
        self.s = s

    @staticmethod
    def is_valid_xml(fragment: str) -> bool:
        """
        Returns True if 'fragment' parses as a single element OR
        as content inside a synthetic root.
        """
        frag = fragment.strip()
        if not frag:
            return False

        # Try as a single element
        try:
            ET.fromstring(frag)
            return True
        except ET.ParseError:
            pass

        # Try wrapped in a root (for text fragments or multiple siblings)
        try:
            ET.fromstring(f"<root>{frag}</root>")
            return True
        except ET.ParseError:
            return False

    @staticmethod
    def contains_tag(line: str) -> bool:
        """True if the entire line is a single tag-like construct."""
        return bool(_TAG_LINE_RE.match(line or ""))

    @staticmethod
    def is_closing_tag(line: str) -> bool:
        line = (line or "").strip()
        return line.startswith("</") and line.endswith(">")

    @staticmethod
    def contains_closing_tag(line: str) -> bool:
        line = (line or "")
        return "</" in line and ">" in line

    @staticmethod
    def contains_opening_tag(line: str) -> bool:
        """
        Returns True if the string contains an opening or self-closing tag,
        ignoring closing tags like </Tag> and special constructs like comments,
        DOCTYPEs, or CDATA.
        
        Examples:
        "<div>"                -> True
        "<img />"              -> True
        "text <p>content</p>"  -> True
        "</p>"                 -> False
        "<!-- comment -->"     -> False
        "<?xml version='1.0'>" -> False
        """
        s = (line or "").strip()
        return bool(_OPEN_TAG_RE.search(s))

    @staticmethod
    def compute_tag_name(line: str) -> str:
        """
        Extract the element/tag name from a string that may contain:
        - a closing tag with surrounding text:  '... </Tag  >'
        - a single opening/self-closing tag:    '<Tag attr="x"/>' or '<Tag>'
        - a full element:                       '<Tag>...</Tag>'

        Preference: if a closing tag exists anywhere in the string, return that name.
        Otherwise, return the first opening/self-closing tag name.

        Raises ValueError if no element tag name is found (e.g., comments/CDATA/PI only).
        """
        s = (line or "").strip()
        if not s:
            raise ValueError(f"Cannot find tag name in empty string")

        # 1) Prefer the last closing tag on the line (handles mixed content '... </tag>')
        last_close = None
        for m in _CLOSE_TAG_RE.finditer(s):
            last_close = m  # keep last match
        if last_close:
            return last_close.group(1)

        # 2) Otherwise, fall back to the first opening/self-closing tag
        m = _OPEN_OR_ANY_TAG_RE.search(s)
        if m:
            return m.group(1)

        # 3) Nothing found (maybe comment/CDATA/PI or plain text)
        raise ValueError(f"Cannot find tag name in: {line!r}")

    @staticmethod
    def escape_special_characters(s: str) -> str:
        """
        Escapes characters that would break XML parsing *when they occur in text*,
        while leaving real tags/entities intact.

        - Escapes any '&' that isn't already an entity (e.g., '&amp;', '&#123;')
        - Escapes any '<' that doesn't begin a valid tag/comment/PI
        - Doubles stray backslashes that are not valid JS escapes (safe for template bodies)
        """
        if not s:
            return s

        _VALID_JS_ESCAPE_AFTER_BACKSLASH = r"[0-7xuXbfnrtv\\'\"`]"
        _TAG_START = r'(?:/?[A-Za-z][A-Za-z0-9:_-]*\b|!--|\?xml|!\[CDATA\[)'

        # 1) Escape stray ampersands first (avoid double-escaping legit entities)
        s = re.sub(r'&(?![A-Za-z#][A-Za-z0-9]*;)', '&amp;', s)

        # 2) Backslashes not followed by a valid escape → double them
        s = re.sub(rf"\\(?!{_VALID_JS_ESCAPE_AFTER_BACKSLASH})", r"\\\\", s)

        # 3) Escape '<' that do NOT introduce a tag/comment/PI/CDATA
        s = re.sub(rf'<(?!{_TAG_START})', '&lt;', s)

        return s
