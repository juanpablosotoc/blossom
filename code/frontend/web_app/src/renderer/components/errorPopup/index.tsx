import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

export default function ErrorPopup({ error }: { error?: string }) {
    const [errorString, setErrorString] = useState(error);

    const TIME_DISPLAYED = 3000; // in milliseconds
    
    const [isDisplayed, setIsDisplayed] = useState(true);
    // Display for TIME_DISPLAYED milliseconds
    useEffect(() => {
        setTimeout(() => {
            setIsDisplayed(false);
            setErrorString("");
        }, TIME_DISPLAYED);
    }, []);

    useEffect(() => {
        if ( error) {
            setIsDisplayed(true);
            setErrorString(error);
        }
    }, [error]);

    return (
        isDisplayed && errorString ? (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <h1>{errorString}</h1>
            </div>
        </div>
        ) : null
    );
}