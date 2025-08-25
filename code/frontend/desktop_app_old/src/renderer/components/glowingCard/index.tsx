import ThreeDCard from '../threeDCard';
import styles from './styles.module.scss';
import { PropsWithChildren } from 'react';


interface Props {
    bgImg: React.ElementType;
}

export default function GlowingCard(props: PropsWithChildren<{className?: string, bgImg: React.ElementType}>) {
    return (
        <ThreeDCard className={`${props.className} ${styles.wrapper}`}>
            <div className={styles.bg}>
                <props.bgImg className={styles.bgImg} />
            </div>
            <div className={styles.fg}>
                <props.bgImg className={styles.bgImg} />
                {props.children}
            </div>
        </ThreeDCard>
    )
};
