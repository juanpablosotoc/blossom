import OpenAI from '@myComponents/logos/llm/openai';
import styles from './styles.module.scss';
import Write from '@myComponents/icons/write';


function Threads() {
    return (
        <div className={styles.container}>
            <div className={styles.threadsWrapper}>
                <div className={styles.wrapper}>
                <div className={styles.top}>
                    <Write />
                </div>
                <div className={styles.group}>
                    <p className={styles.groupLabel}>Today</p>
                    <div className={styles.thread}>
                        <OpenAI theme='light' size='small' />
                        <p className={styles.title}>Thread 1</p>
                    </div>
                    <div className={styles.thread}>
                        <OpenAI theme='light' size='small' />
                        <p className={styles.title}>Thread 1</p>
                    </div>
                    <div className={styles.thread}>
                        <OpenAI theme='light' size='small' />
                        <p className={styles.title}>Thread 1</p>
                    </div>
                    <div className={styles.thread}>
                        <OpenAI theme='light' size='small' />
                        <p className={styles.title}>Thread 1</p>
                    </div>
                </div>
                <div className={styles.group}>
                    <p className={styles.groupLabel}>Last week</p>
                    <div className={styles.thread}>
                        <OpenAI theme='light' size='small' />
                        <p className={styles.title}>Thread 1</p>
                    </div>
                    <div className={styles.thread}>
                        <OpenAI theme='light' size='small' />
                        <p className={styles.title}>Thread 1</p>
                    </div>
                    <div className={styles.thread}>
                        <OpenAI theme='light' size='small' />
                        <p className={styles.title}>Thread 1</p>
                    </div>
                </div>
                </div>
            </div>
            {/* <div className={styles.line}></div> */}
            <div className={styles.previewWrapper}>
                <p>Preview</p>
            </div>
        </div>
    );
}

export default Threads;