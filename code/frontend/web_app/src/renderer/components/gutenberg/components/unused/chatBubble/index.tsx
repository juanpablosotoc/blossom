import React from 'react';
import styles from './styles.module.css';


export default function ChatBubble(props: React.PropsWithChildren<{leftRight: 'left' | 'right'}>) {
    return (
        <div className={styles.wrapper + ' ' + (props.leftRight === 'left' ? styles.left : styles.right)} data-is-parent={true}>
            {props.children}
        </div>
    )
};
