import React from 'react';
import styles from './styles.module.css';

export default function BigUl(props: React.PropsWithChildren<{title?: string}>) {
    const [currentBar, setCurrentBar] = React.useState(0);
    function handleClick(index: number) {
        setCurrentBar(index);
    }
    return (
    <div className={styles.sequence}>
        {props.title && <h3 className={styles.title}>{props.title}</h3>}
        <div className={styles.content}>
        {/* for every child add a bar */ React.Children.map(props.children, (child, index) => {
            return (
                <div className={styles.innerWrapper + ' ' + (currentBar === index ? styles.active : (index < currentBar ? styles.prevActive : ''))}>
                    <div className={styles.bar} onClick={(e)=>{handleClick(index)}}></div>
                    <div className={styles.sequencewrapper}  data-is-parent={true}>
                        {child}
                    </div>
                </div>
            )
        })}
        </div>
    </div>
    )
}