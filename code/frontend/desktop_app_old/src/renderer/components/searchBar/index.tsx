import Search from '@myComponents/icons/search';
import styles from './styles.module.scss';


interface Props {
    theme: 'light' | 'dark';
    size: 'small' | 'large';
}
export default function SearchBar({ theme, size }: Props) {
    return (
        <div className={`${styles.container} ${theme === 'light' ? styles.light : styles.dark} ${size === 'small' ? styles.small : styles.large}`}>
            <Search />
            <input type="text" placeholder="Search" />
        </div>
    );
}