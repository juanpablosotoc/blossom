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
    def compute_tag_name(line: str) -> str:
        """
        Extract the bare tag name from something like:
          <Tag attr="x">, </Tag>, <Tag/>, <Tag .../>
        Returns 'Tag'.
        """
        s = (line or "").strip()
        if not s.startswith("<"):
            raise ValueError(f"Not a tag: {line}")

        i = 1
        if i < len(s) and s[i] == "/":
            i += 1

        start = i
        while i < len(s) and (s[i].isalnum() or s[i] in "._:-"):
            i += 1
        if start == i:
            raise ValueError(f"Cannot find tag name in: {line}")
        return s[start:i]

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