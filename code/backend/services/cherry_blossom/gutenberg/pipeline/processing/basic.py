from .base import Processing
import re


class BasicProcessing(Processing):
    ERROR_MESSAGE = "There was an error parsing the xml"

    # ---------- SAFE ATTRIBUTE NORMALIZER ----------
    @staticmethod
    def normalize_all_attrs_safe(tag: str) -> str:
        """
        Normalize attributes inside a single tag string by tracking quote/brace state.
        - attr={...}  -> attr="... (inner quotes become &quot;)"
        - bare attr=value -> attr="value"
        - never rewrites inside quoted ('...' / "...") or braced {...} regions
        Assumes 'tag' is of the form '<...>'.
        """
        if not tag or tag[0] != "<":
            return tag

        i, n = 0, len(tag)
        out = []
        in_sq = False
        in_dq = False
        brace_depth = 0

        while i < n:
            ch = tag[i]

            # track braces only when not in quotes
            if not in_sq and not in_dq:
                if ch == "{":
                    brace_depth += 1
                elif ch == "}":
                    brace_depth = max(0, brace_depth - 1)

            # toggle quotes when not inside the other quote and not inside braces
            if brace_depth == 0:
                if ch == '"' and not in_sq:
                    in_dq = not in_dq
                    out.append(ch); i += 1; continue
                if ch == "'" and not in_dq:
                    in_sq = not in_sq
                    out.append(ch); i += 1; continue

            # If inside quotes or braces, copy literal
            if in_sq or in_dq or brace_depth > 0:
                out.append(ch); i += 1; continue

            # Outside quotes/braces: safe to normalize
            if ch.isspace():
                out.append(ch); i += 1; continue

            if ch.isalpha() or ch in "_:":
                # read attribute name
                start = i
                i += 1
                while i < n and (tag[i].isalnum() or tag[i] in "._:-"):
                    i += 1
                name = tag[start:i]

                # skip ws
                j = i
                while j < n and tag[j].isspace():
                    j += 1

                if j < n and tag[j] == "=":
                    k = j + 1
                    while k < n and tag[k].isspace():
                        k += 1

                    # name = { ... }
                    if k < n and tag[k] == "{":
                        k += 1
                        inner_start = k
                        depth = 1
                        while k < n and depth > 0:
                            if tag[k] == "{":
                                depth += 1
                            elif tag[k] == "}":
                                depth -= 1
                            k += 1
                        inner = tag[inner_start:k-1] if depth == 0 else tag[inner_start:k]
                        inner = inner.replace('"', "&quot;")
                        out.append(f'{name}="{inner}"')
                        i = k
                        continue

                    # name = "..." or '...' (leave as-is; copied by fallthrough)
                    if k < n and tag[k] in ['"', "'"]:
                        out.append(tag[start:k])  # name + '=' + quote handled in fallthrough
                        i = k
                        continue

                    # name = bareToken  → quote it up to a delimiter
                    delim = k
                    while delim < n and tag[delim] not in ' \t\r\n/>':
                        delim += 1
                    value = tag[k:delim]
                    out.append(f'{name}="{value}"')
                    i = delim
                    continue

                else:
                    # boolean attribute or standalone word
                    out.append(name)
                    i = j
                    continue

            out.append(ch)
            i += 1

        # After building the tag, escape *inner* quotes inside already-quoted values
        return BasicProcessing.escape_inner_quotes_in_attrs("".join(out))

    # ---------- QUOTE ESCAPER ----------
    @staticmethod
    def escape_inner_quotes_in_attrs(s: str) -> str:
        out = []
        i, n = 0, len(s)
        in_tag = False
        in_dq_attr = False

        while i < n:
            ch = s[i]
            if not in_tag:
                if ch == "<":
                    in_tag = True
                out.append(ch); i += 1; continue

            # in tag
            if not in_dq_attr:
                out.append(ch)
                if ch == ">":
                    in_tag = False
                elif ch == '"':
                    in_dq_attr = True
                elif ch == "=":
                    j = i + 1
                    while j < n and s[j].isspace(): j += 1
                    if j < n and s[j] == '"':
                        i = j
                        out.append('"')
                        in_dq_attr = True
                i += 1; continue
            else:
                # inside double-quoted value
                if ch == '"':
                    nxt = s[i + 1] if i + 1 < n else ""
                    if nxt in (" ", ">", "/") or nxt == "":
                        out.append('"')
                        in_dq_attr = False
                    else:
                        out.append("&quot;")
                    i += 1; continue
                else:
                    out.append(ch); i += 1; continue

        return "".join(out)

    # ---------- BODY HANDLERS ----------
    def lossless_handle_body(self, line: str) -> str:
        return self.escape_special_characters(line)

    def lossy_handle_body(self, line: str) -> str:
        name = self.compute_tag_name(line)
        return f"<{name}>{self.ERROR_MESSAGE}</{name}>"

    def handle_body(self, line: str) -> str:
        cleaned = self.lossless_handle_body(line)
        # If valid when wrapped, accept
        if self.is_valid_xml(f"<root>{cleaned}</root>"):
            return cleaned
        # Otherwise fallback to lossy rendering
        return self.lossy_handle_body(line)

    def handle_entire_tag(self, line: str) -> str:
        # Normalize attributes (safe)
        norm = self.normalize_all_attrs_safe(line)
        if self.is_valid_xml(norm):
            return norm
        # Otherwise, treat contents losslessly/then lossy if needed
        return self.handle_body(line)

    def handle_tag(self, line: str) -> str:
        s = line

        # Fast path: already a single valid tag or a pure closing tag
        if self.is_closing_tag(s) or self.is_valid_xml(s):
            return s

        has_open = self.contains_opening_tag(s)
        has_close = self.contains_closing_tag(s)

        # Case 1: the line includes both an opening and a closing tag -> full element
        if has_open and has_close:
            return self.handle_entire_tag(s)

        # Case 2: only opening tag present -> add temporary closing tag, process, then remove it
        if has_open and not has_close:
            name = self.compute_tag_name(s)
            tmp = f"{s}</{name}>"
            processed = self.handle_entire_tag(tmp)
            end_tag = f"</{name}>"
            if processed.endswith(end_tag):
                processed = processed[: -len(end_tag)]
            return processed

        # Case 3: only closing tag present -> add temporary opening tag, process, then remove it
        if has_close and not has_open:
            name = self.compute_tag_name(s)  # should return the closing tag's name
            tmp = f"<{name}>{s}"
            processed = self.handle_entire_tag(tmp)
            start_tag = f"<{name}>"
            if processed.startswith(start_tag):
                processed = processed[len(start_tag):]
            return processed

        # Fallback: no tags at all; treat as body text
        return self.handle_body(s)

    def process(self) -> str:
        lines = self.s.split("\n")
        for idx, line in enumerate(lines[1:-1]):
            if self.contains_tag(line): lines[idx] = self.handle_tag(line)
            else: lines[idx] = self.handle_body(line)
            
        return "<>\n" + "\n".join(lines) + "\n</>"
        