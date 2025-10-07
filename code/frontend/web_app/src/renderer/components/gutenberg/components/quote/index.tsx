import ErrorBoundary from '@/components/errorBoundary';
import styles from './styles.module.css';


interface Props {
    author: string;
}

export default function Quote(props: React.PropsWithChildren<Props>) {
    return (
        <ErrorBoundary errorMessage="Error in Quote component" onError={(error)=>{console.error(error)}}>
        <div className={styles.wrapper}  data-is-parent={true}>
            <p>"{props.children}"</p>
            <p className={styles.author}><i>{props.author}</i></p>
        </div>
        </ErrorBoundary>
    )
}