import ErrorBoundary from '@/components/errorBoundary';
import styles from './styles.module.css';

export default function Frame(props: React.PropsWithChildren<{start: string, end: string, isActive?: boolean}>) {
    return (
        <ErrorBoundary errorMessage="Error in Frame component" onError={(error)=>{console.error(error)}}>
        <div className={styles.frame + ' ' + (props.isActive ? styles.active : '')}  data-is-parent={true}>
            {props.children}
        </div>
        </ErrorBoundary>
    );
}