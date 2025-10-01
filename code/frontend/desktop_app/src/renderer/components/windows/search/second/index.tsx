import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";

interface Props {
  url: string;
}

export default function Second({ url }: Props) {
  const wvRef = useRef<Electron.WebviewTag>(null);

  useEffect(() => {
    const wv = wvRef.current;
    if (!wv) return;

    const setIframeHeight = () => {
      const iframe = wv.shadowRoot?.querySelector("iframe") as HTMLIFrameElement | null;
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
      if (wv.shadowRoot) {
        mo.observe(wv.shadowRoot, { childList: true, subtree: true });
      }
    };

    wv.addEventListener("dom-ready", onDomReady);

    return () => {
      wv.removeEventListener("dom-ready", onDomReady);
    };
  }, [url]);

  return (
    <div className={styles.container}>
      <webview
        ref={wvRef}
        src={url}
        style={{ width: "100%", height: "100%", display: "block", borderRadius: "12px" }}
      />
    </div>
  );
}