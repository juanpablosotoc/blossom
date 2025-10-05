import styles from './styles.module.scss';
import { DOWNLOAD_URL } from '@/utils/download';


interface Props {
    className?: string;
}

export default function Download(props: Props) {
    function handleDownload() {
        window.open(DOWNLOAD_URL, '_blank');
    }
    
    return (
        <div className={`${styles.container} ${props.className ? props.className : ''}`} onClick={handleDownload}>
            <p>Download for MacOS</p>
        </div>
    );
}