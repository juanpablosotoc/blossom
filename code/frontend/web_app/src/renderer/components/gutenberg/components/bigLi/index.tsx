import ErrorBoundary from '@/components/errorBoundary';
import styles from './styles.module.css';


export default function BigLi(props: React.PropsWithChildren<{title: string}>) {
    // const customFallbackRender = (props: { error: Error }) => (
    //     <div className={styles.sequenceEvent}>
    //         <div className={styles.metadata}>
    //             <p className={styles.title}>{props.title}</p>
    //         </div>
    //         <div className={styles.content}  data-is-parent={true}>
    //             <p>Error in BigLi component</p>
    //         </div>
    //     </div>
    // );
    const customFallbackRender = () => (
        <p>Error in BigLi component</p>
    );

    return (
        <div className={styles.sequenceEvent}>
            <div className={styles.metadata}>
                <p className={styles.title}>{props.title}</p>
            </div>
            <div className={styles.content}  data-is-parent={true}>
                    <ErrorBoundary errorMessage="Error in BigLi component" onError={(error)=>{
                        console.error(error);
                        customFallbackRender;
                    }}>
                    {props.children}
                    </ErrorBoundary>
            </div>
        </div>
    );
}