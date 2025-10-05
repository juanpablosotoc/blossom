import styles from './styles.module.css';


export default function Image(props: React.PropsWithChildren<{}>) {
    return (
        <div className={styles.image} data-is-parent={true}>
            {props.children}
        </div>
    );
}