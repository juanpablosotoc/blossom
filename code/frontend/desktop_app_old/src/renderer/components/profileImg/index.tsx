import styles from './styles.module.scss';

interface Props {
    src: string;
}

export default function ProfileImg(props: Props) {
    return <div className={styles.container}>
        <img 
            src={props.src} 
            onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                const className = img.naturalWidth > img.naturalHeight ? styles.horizontal : styles.vertical;
                img.classList.add(className);
            }}
        />
    </div>;
}