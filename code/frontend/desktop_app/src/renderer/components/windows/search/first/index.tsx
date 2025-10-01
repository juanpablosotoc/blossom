import styles from './styles.module.scss';
import Group from '@/components/tabGroups';
import { useState } from 'react';
import SearchBar from '@/components/searchBar';

function First() {
    const [activeRow, setActiveRow] = useState(2);
    const [activeColumn, setActiveColumn] = useState(2);
    
    return (
        <div className={styles.container}>
            <div className={styles.modalContent}>
                <div className={styles.tabs}>
                    <div className={styles.tabsSep}
                    onMouseLeave={()=>{
                        setActiveRow(2);
                        setActiveColumn(2);
                    }}>
                        <Group activeRow={activeRow} activeColumn={activeColumn} row={0} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} />
                        <Group activeRow={activeRow} activeColumn={activeColumn} row={1} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} />
                        <Group activeRow={activeRow} activeColumn={activeColumn} row={2} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} />
                        <Group activeRow={activeRow} activeColumn={activeColumn} row={3} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} />
                        <Group activeRow={activeRow} activeColumn={activeColumn} row={4} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} />
                    </div>
                </div>  
                <SearchBar className={styles.searchBar} />
            </div>
        </div>
    );
}

export default First;