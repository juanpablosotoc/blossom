import styles from './styles.module.scss';
import Nav from '@myFrames/nav';
import Footer from '@myFrames/footer';
import WindowCarrousel from '@myFrames/windowCarrousel';
import { useState } from 'react';

export default function Home() {
    const [activeWindow, setActiveWindow] = useState(0);

    
    return (
        <div className={styles.container}>
            <Nav />
            <WindowCarrousel setActiveWindow={setActiveWindow} activeWindow={activeWindow} />
            <Footer circleCount={3} activeCircle={activeWindow} label={'Home'} />
        </div>
    );
};
