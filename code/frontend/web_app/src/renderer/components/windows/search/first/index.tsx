import styles from './styles.module.scss';
import { useState } from 'react';
import SearchBar from '@/components/searchBar';
import TabGrid from '@/components/tabGrid';
import { Node } from '@/utils/treeTypes';


interface Props {
    tree: Node[][];
}

function First(props: Props) {
    const [choice, setChoice] = useState<'search' | 'tabs'>('search');

    return (
        <div className={styles.container}>
            <div className={styles.modalContent}>
                <div className={styles.choiceWrapper}>
                    <div className={`${styles.choice} ${choice === 'search' ? styles.active : ''}`} onMouseEnter={()=>setChoice('search')}>
                        <p>Search</p>
                    </div>
                    <div className={`${styles.choice} ${choice === 'tabs' ? styles.active : ''}`} onMouseEnter={()=>setChoice('tabs')}>
                        <p>Tabs</p>
                    </div>
                </div>

                <div className={`${styles.choiceContent} ${choice === 'search' ? styles.active : ''}`}>
                    <SearchBar className={styles.searchBar} setSearchQuery={()=>{}} />
                </div>
                <div className={`${styles.choiceContent} ${choice === 'tabs' ? styles.active : ''}`}>
                    <div className={styles.tabs}>
                        <div className={styles.tabsSep}
                        >
                            <TabGrid tree={props.tree} setActiveTabId={()=>{}} onCreateDir={()=>{}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default First;