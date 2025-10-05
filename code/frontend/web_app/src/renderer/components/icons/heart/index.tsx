import styles from './styles.module.scss';
import HeartIcon from '@myAssets/icons/heart.svg?react';


interface Props {
    className?: string;
}

function Heart({ className }: Props) {
    return (
        <HeartIcon className={`${styles.heart} ${className}`} />
    )
};

export default Heart;