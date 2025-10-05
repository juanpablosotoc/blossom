import DownArrow from '@myAssets/icons/git-arrow.svg?react';
import styles from './styles.module.scss';

interface Props {
    direction: 'up' | 'down' | 'left' | 'right';
    hasStem: boolean;
    className?: string;
    hovered?: boolean;
}

function Chevron(props: Props) {
    const directionClasses = {'up': styles.up, 'down': styles.down, 'left': styles.left, 'right': styles.right};

    return (
        <div className={`${styles.wrapper} 
        ${directionClasses[props.direction]} 
        ${props.hasStem && styles.hasStem} 
        ${props.className && props.className}
        ${props.hovered && styles.hovered}`}>
            <DownArrow className={styles.arrow} />
        </div>
    )
}


export default Chevron;
