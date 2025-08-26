import styles from './styles.module.scss';
import type { SUGGESTION_TYPES } from '../index';
import {ReactComponent as LinkSVG} from '@myAssets/icons/link.svg';
import TwoFloorText from '@myComponents/twoFloorText';
import { useState } from 'react';


interface Props {
    type: SUGGESTION_TYPES | null;
    className?: string;
    row: number;
    column: number;
    setRow: (row: number) => void;
    setColumn: (column: number) => void;
}
function Suggestion({ type, className, row, column, setRow, setColumn }: Props) {
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
        setRow(row);
        setColumn(column);
    };
    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div className={`${type ? styles.full : ''} ${className} ${styles.container}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <>
            {type === 'file' ? (
                    <div className={styles.content}>
                        
                        <LinkSVG />
                        <TwoFloorText text='File' hovered={hovered} />
                    </div>
            ) : (type === 'link' ? (
                    <div className={styles.content}>
                        
                        <LinkSVG />
                        <TwoFloorText text='Link' hovered={hovered} />
                    </div>
                ) : (type === 'tab' ? (
                    <div className={styles.content}>
                        
                        <LinkSVG />
                        <TwoFloorText text='Tab' hovered={hovered} />
                    </div>
                ) : type === 'Voice Message' ? (
                    // Voice Message
                    <div className={styles.content}>
                        <LinkSVG />
                        <TwoFloorText text='Voice Message' hovered={hovered} />
                    </div>
                ) : null))}
            </>
        </div>
    )
};


export default Suggestion;
