import SearchIcn from '../icons/search';
import styles from './styles.module.scss';


interface Props {
    className?: string;
}

function SearchBar(props: Props) {
    return (
        <div className={`${styles.container} ${props.className ? props.className : ''}`}>
            <div className={styles.searchInput}>
                <SearchIcn className={styles.searchIcon} />
                <input type="text" placeholder="Search or Enter URL..." />
            </div>
            <div className={styles.searchSeparator}></div>
        </div>
    );
}

export default SearchBar;