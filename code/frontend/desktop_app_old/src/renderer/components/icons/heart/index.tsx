import styles from './styles.module.scss';
import { ReactComponent as HeartIcon } from '@myAssets/icons/heart.svg';

function Heart() {
    return (
        <HeartIcon className={styles.heart} />
    )
};

export default Heart;