import general from '../general.module.scss';
import styles from './styles.module.scss';
import Second from './second';
import First from './first';


interface Props {
    isActive: boolean;
};

function Assistant({ isActive }: Props) {

    return (
        <div className={`${general.window} ${styles.container} ${isActive ? general.active : ''}`}>
            <div className={styles.wrapper}>
                <div className={styles.firstWrapper}>
                    <First />
                </div>
                <div className={styles.secondWrapper}>
                    <Second />
                </div>
            </div>
        </div>
    );
};

export default Assistant;

