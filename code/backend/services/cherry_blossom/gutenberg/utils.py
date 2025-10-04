import execjs
from myExceptions.service import ServiceError

def escape_jsx(content):
    """
    Escapes JSX content using a JavaScript function.

    Args:
        content (str): The JSX content to be escaped.

    Returns:
        str: The escaped JSX content.

    Raises:
        EscapeJsxError: If there is an error while escaping the JSX content.
    """
    with open('process_jsx.js', 'r') as file:
        js_code = file.read()

    try:
        ctx = execjs.compile(js_code)
        escaped_jsx = ctx.call('processJSX', content)
        return escaped_jsx
    except Exception as e:
        print(f"Error in escape_jsx: {e}")
        raise ServiceError(f"Failed to escape JSX\n{e}")
