import styles from './styles.module.scss';
import image1 from '@myAssets/images/1.jpg';
import Tab from './tab';


function Group ({activeRow, activeColumn, row, setActiveRow, setActiveColumn}: {activeRow: number, activeColumn: number, row: number, setActiveRow: (row: number) => void, setActiveColumn: (column: number) => void}) {
    return (
        <div className={styles.group}>
            <Tab activeRow={activeRow} activeColumn={activeColumn} row={row} column={0} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} />
            <Tab activeRow={activeRow} activeColumn={activeColumn} row={row} column={1} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} content={{
                thumbnail: image1,
                favicon: image1,
                title: 'Title',
                type: 'open'
            }} />
            <Tab activeRow={activeRow} activeColumn={activeColumn} row={row} column={2} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} content={{
                thumbnail: image1,
                favicon: image1,
                title: 'Title',
                type: 'liked'
            }} />
            <Tab activeRow={activeRow} activeColumn={activeColumn} row={row} column={3} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} content={{
                thumbnail: image1,
                favicon: image1,
                title: 'Title',
                type: 'pinned'
            }} />
            <Tab activeRow={activeRow} activeColumn={activeColumn} row={row} column={4} setActiveRow={setActiveRow} setActiveColumn={setActiveColumn} />

        </div>
    )
};


export default Group;
