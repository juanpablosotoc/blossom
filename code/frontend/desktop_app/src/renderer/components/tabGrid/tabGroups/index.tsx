import Tab from "./tab";
import { Node } from "@myUtils/treeTypes";
import styles from "./styles.module.scss";

interface Props {
  rowIdx: number;
  rowData: Node[];
  activeRow: number;
  activeCol: number;
  setActiveRow: (r: number) => void;
  setActiveCol: (c: number) => void;
  setActiveTabId: (id: string) => void;
  onCreateDir: (row: number, col: number, name: string) => void;
}

export default function Group({
  rowIdx,
  rowData,
  activeRow,
  activeCol,
  setActiveRow,
  setActiveCol,
  setActiveTabId,
  onCreateDir,
}: Props) {
  return (
    <div className={styles.group}>
      {rowData.map((node, col) => (
        <Tab
          key={node.id}
          row={rowIdx}
          col={col}
          content={node}
          activeRow={activeRow}
          activeCol={activeCol}
          setActiveRow={setActiveRow}
          setActiveCol={setActiveCol}
          setActiveTabId={setActiveTabId}
          onCreateDir={onCreateDir}
        />
      ))}
    </div>
  );
}