import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import CircledArrow from '@myComponents/icons/circledArrow';


interface Content {
    thumbnail: string;
    title: string;
    favicon: string;
    type: 'liked' | 'open' | 'pinned' | 'downloaded';
}

interface Props {
    content?: Content;
    activeRow: number;
    activeColumn: number;
    setActiveRow: (row: number) => void;
    setActiveColumn: (column: number) => void;
    row: number;
    column: number;
}

function Tab ({content, activeRow, activeColumn, row, column, setActiveRow, setActiveColumn}: Props) {
    const [opacity, setOpacity] = useState(0);

    function calculateEuclideanDistance () {
        const x1 = activeRow;
        const y1 = activeColumn;
        const x2 = row;
        const y2 = column;

        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    useEffect(() => {
        const distance = calculateEuclideanDistance();
        setOpacity(1 - distance / 4);
    }, [activeRow, activeColumn, row, column]);

    return (
        <div className={`${styles.tab} ${content ? '' : styles.empty}`} style={{opacity}}
        onMouseEnter={() => {
            setActiveRow(row);
            setActiveColumn(column);
        }} >
            {content && (
                <>
                    <img className={styles.thumbnail} src={content.thumbnail} alt="" />
                    <div className={styles.modal}></div>
                    <CircledArrow className={styles.icon} direction='down' size='small' theme='dark' onClick={() => {}}></CircledArrow>
                    <div className={styles.metadata}>
                        <img src={content.favicon} className={styles.favicon} alt="" />
                        <p className={styles.title}>{content.title}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default Tab;