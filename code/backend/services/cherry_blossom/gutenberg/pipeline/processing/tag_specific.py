from .base import Processing
import re

class TagSpecificProcessing(Processing):
    def process(self) -> str:
        s = self.s

        # ------- Code block handling -------
        code_open_re = re.compile(
            r"<\s*Code\s+language\s*=\s*(?P<quote>['\"]?)(?P<lang>[^'\"\s>]+)(?P=quote)\s*>",
            flags=re.IGNORECASE,
        )

        def _open_code_sub(m: re.Match) -> str:
            lang = m.group("lang")
            return f"<Code language={lang}>\n{{`"

        s = code_open_re.sub(_open_code_sub, s)
        s = re.sub(r"<\s*/\s*Code\s*>", "`}\n</Code>", s, flags=re.IGNORECASE)

        # Escape ONLY inside Code template literal bodies
        CODE_BLOCK_RE = re.compile(
            r"(<\s*Code\b[^>]*>\s*\{\`)(.*?)(\`\}\s*</\s*Code\s*>)",
            flags=re.IGNORECASE | re.DOTALL,
        )

        _VALID_JS_ESCAPE_AFTER_BACKSLASH = r"[0-7xuXbfnrtv\\'\"`]"

        def _sanitize_for_js_parser(text: str) -> str:
            if not text:
                return text
            return re.sub(rf"\\(?!{_VALID_JS_ESCAPE_AFTER_BACKSLASH})", r"\\\\", text)

        def _escape_code_body(m: re.Match) -> str:
            head, body, tail = m.group(1), m.group(2), m.group(3)
            body = _sanitize_for_js_parser(body)
            body = body.replace("`", r"\`")
            body = body.replace("${", r"\${")
            return f"{head}{body}{tail}"

        s = CODE_BLOCK_RE.sub(_escape_code_body, s)

        return s
        