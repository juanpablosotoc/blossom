// Search.tsx
import general from '../general.module.scss';
import styles from './styles.module.scss';
import First from './first';
import { useState } from 'react';
import { Node } from '@/utils/treeTypes';
import { createEmptyGrid } from "@myUtils/tree";

interface Props { 
  isActive: boolean;
};

function Search({ isActive }: Props) {
  const [tree, setTree] = useState<Node[][]>(() => {
    const grid = createEmptyGrid();
    // (your sample seeding can stay or be removed)
    return grid;
  });

  return (
    <div className={`${general.window} ${styles.container} ${isActive ? general.active : ''}`}>
      <div className={styles.wrapper}>
        <div className={styles.firstWrapper}>
          <First tree={tree} />
        </div>
      </div>
    </div>
  );
}

export default Search;