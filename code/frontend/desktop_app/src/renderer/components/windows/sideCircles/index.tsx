import styles from './styles.module.scss';


interface Props {
    circleCount: number;
    activeCircle: number;
    isActive: boolean;
}

function SideCircles({ circleCount, activeCircle, isActive }: Props) {
    return (
        <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
            {Array.from({ length: circleCount }).map((_, index) => (
                <div className={`${styles.circle} ${index === activeCircle ? styles.active : ''}`} key={index} />
            ))}
        </div>
    );
}

export default SideCircles;