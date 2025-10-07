from fastapi import HTTPException


# Helper to format SSE data
def sse_data(text: str) -> str:
    """
    Format one SSE 'message' from arbitrary text.
    Each line is prefixed with 'data: ' and ends with a blank line.
    """
    # If text is empty, still send a blank data line (valid SSE)
    lines = text.splitlines() if text else [""]
    return "".join(f"data: {ln}\n" for ln in lines) + "\n"

# ---------- helper to normalize myOpenAI outputs ----------
def _extract_thread_id(created) -> str:
    if isinstance(created, str):
        return created
    tid = getattr(created, "id", None)
    if tid:
        return tid
    if isinstance(created, dict) and created.get("id"):
        return created["id"]
    raise HTTPException(status_code=500, detail="Failed to create thread id")
    