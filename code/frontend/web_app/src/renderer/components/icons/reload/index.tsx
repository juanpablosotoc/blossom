import styles from './styles.module.scss';
import ReloadIcon from '@myAssets/icons/reload.svg?react';


interface Props {
    className?: string;
}

function Reload({ className }: Props) {
    return (
        <ReloadIcon className={`${styles.reload} ${className}`} />
    )
}

export default Reload;