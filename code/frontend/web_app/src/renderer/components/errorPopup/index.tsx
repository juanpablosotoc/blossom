import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

export default function ErrorPopup({ error }: { error?: string }) {
    const TIME_DISPLAYED = 3000; // in milliseconds
    
    const [isDisplayed, setIsDisplayed] = useState(true);
    // Display for TIME_DISPLAYED milliseconds
    useEffect(() => {
        setTimeout(() => {
            setIsDisplayed(false);
        }, TIME_DISPLAYED);
    }, []);

    useEffect(() => {
        if ( error) {setIsDisplayed(true); }
    }, [error]);

    return (
        isDisplayed ? (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <h1>{error ? error : "An error occurred"}</h1>
            </div>
        </div>
        ) : null
    );
}