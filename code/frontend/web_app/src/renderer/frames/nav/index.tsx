import Blossom from '@myComponents/logos/blossom';
import styles from './styles.module.scss';
import ProfileImg from '@myComponents/profileImg';
import ProfileImgSrc from '@myAssets/images/profile.png';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import Download from '@myComponents/download';


export default function Nav() {
    // const [activeRow, setActiveRow] = useState(2);
    // const [activeColumn, setActiveColumn] = useState(2);

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <Blossom theme="light" size="large" />
            </div>
            <div className={styles.middle}>
                <Download className={styles.download} />
            </div>
            <div className={styles.right}>
                <ProfileImg src={ProfileImgSrc} />
            </div>
            {createPortal(<div className={styles.blurryModal}>
            </div>, document.body)}
            {/* {createPortal(<div className={styles.darkModal}>
                <div className={styles.modalContent}>
                    <SearchBar theme='dark' size='large' />
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
                </div>
            </div>, document.body)} */}
        </div>
    );
};