import { useEffect, useState } from 'react';
import ChatInput from '@myComponents/chatInput';
import styles from './styles.module.scss';
import Neon from '@myComponents/icons/neon';
import Suggestion from './suggestion';


export type SUGGESTION_TYPES = 'file' | 'link' | 'tab' | 'Voice Message';


function Second() {
    const [chatFocused, setChatFocused] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState<string>('neon');

    const [placeHolderClass, setPlaceHolderClass] = useState<string>('');

    const [activeRow, setActiveRow] = useState(2);
    const [activeColumn, setActiveColumn] = useState(2);
    const [opacities, setOpacities] = useState(Array.from({ length: 25 }).map(() => 0.4));
    const suggestionMap: Record<number, SUGGESTION_TYPES> = {7: 'file', 11: 'Voice Message', 13: 'link', 17: 'tab'};
    const numColumns = 5;

    function getRowColumn(index: number) {
        return {
            row: Math.floor(index / numColumns),
            column: index % numColumns
        }
    }

    function calculateEuclideanDistance (row: number, column: number) {
        const x1 = activeRow;
        const y1 = activeColumn;
        const x2 = row;
        const y2 = column;

        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    useEffect(() => {
        setOpacities(prev => prev.map((opacity, i) => {
            const { row, column } = getRowColumn(i);
            const distance = calculateEuclideanDistance(row, column);
            return 1 - distance / 4;
        }));
    }, [activeRow, activeColumn]);

    let prevTimer: NodeJS.Timeout | null = null;

    useEffect(() => {
        setPlaceHolderClass(styles.op0);

        if (prevTimer) {
            clearTimeout(prevTimer);
        }
        prevTimer = setTimeout(()=> {
            if (chatFocused) {
                setCurrentPlaceholder('suggestions');
            } else {
                setCurrentPlaceholder('neon');
            }
            setTimeout(()=> {
                setPlaceHolderClass('');
            }, 16);
        }, 300)
    }, [chatFocused]);

    function handleChatFocus() {
        setChatFocused(true);
    }

    function handleChatBlur() {
        setChatFocused(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.middle}>
                {currentPlaceholder === 'neon' ? (
                    <Neon className={`${styles.neon} ${placeHolderClass}`} />
                ) : (
                    <div className={`${styles.grid} ${placeHolderClass}`} 
                    onMouseLeave={() => {
                        setActiveRow(2);
                        setActiveColumn(2);
                    }}>
                    {Array.from({ length: 25 }).map((_, item) => {
                        const { row, column } = getRowColumn(item);
                        return (
                            <div key={`itemwrapper${item}`} className={styles.item}>
                                <div className={styles.innerWrapper}>
                                    <Suggestion type={suggestionMap[item] || null} row={row} column={column} setRow={setActiveRow} setColumn={setActiveColumn} />
                                    <div className={styles.curtain} style={{opacity: 1 - opacities[item]}}></div>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>
            <ChatInput className={styles.chatInput} hasFileUpload={true} theme='light' placeholder='Message Cherry Blossom' onFocus={handleChatFocus} onBlur={handleChatBlur} />
        </div>
    );
};

export default Second;
