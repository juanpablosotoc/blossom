import styles from './styles.module.css';

export default function Frame(props: React.PropsWithChildren<{start: string, end: string, isActive?: boolean}>) {
    return (
        <div className={styles.frame + ' ' + (props.isActive ? styles.active : '')}  data-is-parent={true}>
            {props.children}
        </div>
    );
}