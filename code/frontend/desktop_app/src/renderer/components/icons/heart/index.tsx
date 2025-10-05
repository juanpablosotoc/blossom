import styles from './styles.module.scss';
import { ReactComponent as HeartIcon } from '@myAssets/icons/heart.svg';


interface Props {
    className?: string;
}

function Heart({ className }: Props) {
    return (
        <HeartIcon className={`${styles.heart} ${className}`} />
    )
};

export default Heart;