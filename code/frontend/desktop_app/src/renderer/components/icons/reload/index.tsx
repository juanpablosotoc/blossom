import styles from './styles.module.scss';
import { ReactComponent as ReloadIcon } from '@myAssets/icons/reload.svg';


interface Props {
    className?: string;
}

function Reload({ className }: Props) {
    return (
        <ReloadIcon className={`${styles.reload} ${className}`} />
    )
}

export default Reload;