import ErrorBoundary from '@/components/errorBoundary';
import styles from './styles.module.css';


export default function Image(props: React.PropsWithChildren<{}>) {
    return (
        <ErrorBoundary errorMessage="Error in Image component" onError={(error)=>{console.error(error)}}>  
        <div className={styles.image} data-is-parent={true}>
            {props.children}
        </div>
        </ErrorBoundary>
    );
}