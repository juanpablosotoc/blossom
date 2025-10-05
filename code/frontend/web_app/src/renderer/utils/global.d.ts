declare module "*.module.css";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<React.HTMLAttributes<Electron.WebviewTag>, Electron.WebviewTag> & {
        src?: string;
        allowpopups?: string | boolean;
        partition?: string;
        disableblinkfeatures?: string;
      };
    }
  }

  interface Window {
    // add things you expose via preload later if needed
  }
}

export {};