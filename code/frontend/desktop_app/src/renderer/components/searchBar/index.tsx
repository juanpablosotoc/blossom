import SearchIcn from '../icons/search';
import styles from './styles.module.scss';
import Neon from '@myAssets/images/neon/image.png';
import Blossom from '@myComponents/logos/blossom';


interface Props {
    className?: string;
    setSearchQuery: (query: string) => void;
}

function SearchBar(props: Props) {
    return (
        <div className={`${styles.container} ${props.className ? props.className : ''}`}>
            <div className={styles.contentWrapper} onClick={() => {
                // focus the textarea
                document.querySelector('textarea')?.focus();
            }}>
                <Blossom size='small' theme='light' className={styles.blossom} />
                <textarea 
                    placeholder='Search or Enter URL...' 
                    spellCheck={false} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            // make textarea empty
                            e.currentTarget.value = '';
                            // unfocus the textarea
                            e.currentTarget.blur();
                            props.setSearchQuery(value);
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default SearchBar;