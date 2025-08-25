import Heart from '@myComponents/icons/heart';
import styles from './styles.module.scss';
import CircledArrow from '@myComponents/icons/circledArrow';


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