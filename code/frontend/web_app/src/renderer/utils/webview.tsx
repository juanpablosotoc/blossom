export const createWebview = (url: string, id: string): Electron.WebviewTag => {
    const wv = document.createElement("webview") as Electron.WebviewTag;
    wv.src = url;
    wv.partition = `persist:tab-${id}`;        // persistent session per tab
    Object.assign(wv.style, {
      width: "100%",
      height: "100%",
      display: "block",
      borderRadius: "12px",
    });
  
    return wv;
}
