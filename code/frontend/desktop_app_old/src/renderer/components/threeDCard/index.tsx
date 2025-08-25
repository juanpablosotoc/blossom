import { getXYPercentages } from '@myUtils/functions';
import styles from './styles.module.scss';
import { PropsWithChildren, useRef } from 'react';


function ThreeDCard(props: PropsWithChildren<{className?: string}>) {
    const wrapper = useRef<HTMLDivElement>(null);

    function handleHover(e: any) {
        const { xPercent, yPercent } = getXYPercentages(e, wrapper.current);
        let x;
        let y;
        x = (yPercent - 50) / 5;
        y = (xPercent - 50) / 5;
        y /= -4;
        x /= 3;
        wrapper.current!.style.transform = `perspective(400px) rotateY(${y}deg) rotateX(${x}deg)`;
    };
    function handleLeave() {
        wrapper.current!.style.transform = `perspective(400px) rotateY(0deg) rotateX(0deg)`;
    }

    return (
        <div className={`${styles.wrapper} ${props.className}`} ref={wrapper} 
        onMouseMove={handleHover} onMouseLeave={handleLeave}>
            {props.children}
        </div>
    )
};


export default ThreeDCard;
