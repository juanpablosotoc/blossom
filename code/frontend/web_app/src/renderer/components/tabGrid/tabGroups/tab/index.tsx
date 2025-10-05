import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Node, isDir } from "@myUtils/treeTypes";
import FolderIcon from "@myAssets/icons/dir.svg?react";

interface Props {
  row: number;
  col: number;
  content: Node;
  activeRow: number;
  activeCol: number;
  setActiveRow: (r: number) => void;
  setActiveCol: (c: number) => void;
  setActiveTabId: (id: string) => void;
  onCreateDir: (row: number, col: number, name: string) => void;
}

export default function Tab({
  row,
  col,
  content,
  activeRow,
  activeCol,
  setActiveRow,
  setActiveCol,
  setActiveTabId,
  onCreateDir,
}: Props) {
  const isActive = row === activeRow && col === activeCol;
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const dx = row - activeRow;
    const dy = col - activeCol;
    const distance = Math.sqrt(dx * dx + dy * dy);
    setOpacity(Math.max(0, 1 - distance / 4));
  }, [activeRow, activeCol, row, col]);

  const handleClick = () => {
    // if empty prompt for folder name and create dir
    if (content.type === "empty") {
      const name = window.prompt("Folder name?"); // OS/Chromium modal prompt
      if (name && name.trim()) onCreateDir(row, col, name.trim());
      return;
    }
    // Leaf tab → activate its webview
    if (!isDir(content)) {
      setActiveTabId(content.id);
      return;
    }
    // Dir → you might open it or do something else later
  };

  return (
    <div
      className={`${styles.tab} ${isActive ? styles.active : ""}`}
      onMouseEnter={() => {
        setActiveRow(row);
        setActiveCol(col);
      }}
      onClick={handleClick}
      style={{ opacity }}
    >
      {isDir(content) ? (
        <div className={styles.dir}>
          <FolderIcon />
          <p>
            {content.title ?? "Folder"} ({content.children.length})
          </p>
        </div>
      ) : (
        <div className={styles.leaf + " " + (content.type === "empty" ? styles.empty : "")}>
          {content.type !== "empty" && (
            <>
              {content.favicon && (
                <img src={content.favicon} alt="icon" className={styles.favicon} />
              )}
              <p>{content.title ?? content.type}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}