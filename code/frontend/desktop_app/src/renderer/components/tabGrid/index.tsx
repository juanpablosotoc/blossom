import { useEffect, useState } from "react";
import Group from "./tabGroups";
import { Node } from "@myUtils/treeTypes";
import styles from "./styles.module.scss";


interface Props {
  tree: Node[][];
  setActiveTabId: (id: string) => void;
  onCreateDir: (row: number, col: number, name: string) => void;
}

export default function Grid({ tree, setActiveTabId, onCreateDir }: Props) {
  const middleIdx = 2;
  const [workingDir, setWorkingDir] = useState<string>("/some/path/");

  const [activeRow, setActiveRow] = useState(middleIdx);
  const [activeCol, setActiveCol] = useState(middleIdx);

  return (
    <div className={styles.grid}
    onMouseLeave={()=>{
      setActiveRow(middleIdx);
      setActiveCol(middleIdx);
    }}
    >
        <div className={styles.workingDirWrapper}>
            <p>{workingDir}</p>
        </div>
        <div className={styles.gridWrapper}>
      {tree.map((rowData, row) => (
        <Group
          key={row}
          rowIdx={row}
          rowData={rowData}
          activeRow={activeRow}
          activeCol={activeCol}
          setActiveRow={setActiveRow}
          setActiveCol={setActiveCol}
          setActiveTabId={setActiveTabId}
          onCreateDir={onCreateDir}
            />
          ))}
        </div>
    </div>
  );
}