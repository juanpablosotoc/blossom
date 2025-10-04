import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";

export default function Second({ webview }: { webview: Electron.WebviewTag }) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!webview) return;
    const slot = slotRef.current!;

    // attach into visible slot
    slot.appendChild(webview);

    const setIframeHeight = () => {
      const iframe = webview.shadowRoot?.querySelector("iframe") as HTMLIFrameElement | null;
      if (iframe) {
        iframe.style.height = "100%";
        iframe.style.width = "100%";
        iframe.style.display = "block";
      }
    };

    const onDomReady = () => {
      setIframeHeight();
      // Watch for iframe being replaced
      const mo = new MutationObserver(() => setIframeHeight());
      if (webview.shadowRoot) {
        mo.observe(webview.shadowRoot, { childList: true, subtree: true });
      }
    };

    webview.addEventListener("dom-ready", onDomReady);

    return () => {
      webview.removeEventListener("dom-ready", onDomReady);
      // park back in stash on unmount/switch (do NOT destroy)
      document.getElementById("webview-stash")?.appendChild(webview);
    };
  }, [webview]);

  return <div ref={slotRef} className={styles.container} />;
}