import styles from './styles.module.scss';
import SearchIcon from '@myAssets/icons/search.svg?react';


interface Props {
    className?: string;
}
export default function Search(props: Props) {
    return (
        <SearchIcon className={`
            ${styles.container} 
            ${props.className ? props.className : ''}
        `} />
    );
};