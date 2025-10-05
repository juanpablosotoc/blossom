import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { createPortal } from 'react-dom';


function SwipeRight() {
    // Once it is shown start counting to 5 seconds and then hide it
    const [isShown, setIsShown] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            handleContinue();
        }, 5000);
    }, []);

    if (!isShown) return null;

    const handleContinue = () => {
        setIsShown(false);
        localStorage.setItem('hasUsedApp', 'true');
    }

    return (
        <div className={styles.container}>
            <div className={styles.keypad}>
                <div className={styles.finger}></div>
                <div className={styles.finger}></div>
            </div>
            <p>Use the swipe right gesture.</p>
            <div className={styles.continueBtn} onClick={handleContinue}>
                <p>Continue...</p>
            </div>
            {/* React portal div */}
            {createPortal(<div className={styles.blurryModal}>
            </div>, document.body)}
        </div>
    )
}

export default SwipeRight;
