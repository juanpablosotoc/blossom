import Heart from '@myComponents/icons/heart';
import styles from './styles.module.scss';
import CircledArrow from '@myComponents/icons/circledArrow';
// import Chevron from '@myComponents/icons/chevron';
// import Reload from '@myComponents/icons/reload';


interface Props {
    circleCount: number;
    activeCircle: number;
    label: string;
}
function Footer({ circleCount, activeCircle, label }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <p>{label}</p>
                {/* {showSearchWindowBtns && (
                    <div className={styles.windowBtns}>
                        <div>
                            <Chevron direction='left' hasStem={false} />
                        </div>
                        <div>
                            <Chevron direction='right' hasStem={false} />
                        </div>
                        <div>
                            <Reload />
                        </div>
                    </div>
                )} */}
            </div>
            <div className={styles.middle}>
                {Array.from({ length: circleCount }).map((_, index) => (
                    <div className={`${styles.circle} ${index === activeCircle ? styles.active : ''}`} key={index} />
                ))}
            </div>
            <div className={styles.right}>
                <Heart />
                <CircledArrow direction='down' onClick={() => {}} size='small' theme='dark' />
            </div>
        </div>
    )
};

export default Footer;