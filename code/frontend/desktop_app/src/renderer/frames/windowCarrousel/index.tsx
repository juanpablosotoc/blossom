import React, { useEffect, useRef, useState, useCallback } from 'react';
import Assistant from '@myComponents/windows/assistant';
import styles from './styles.module.scss';
import BlossomGarden from '@myComponents/windows/blossomGarden';

interface Props {
    setActiveWindow: (window: number) => void;
    activeWindow: number;
}

const WindowCarrousel: React.FC<Props> = ({ setActiveWindow, activeWindow }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [childWidth, setChildWidth] = useState<number>(0);
    const windows = [Assistant, BlossomGarden];

    // Measure the width of a child after the component mounts
    useEffect(() => {
        const measureChildWidth = () => {
            if (containerRef.current && containerRef.current.firstElementChild) {
                const firstChild = containerRef.current.firstElementChild as HTMLElement;
                setChildWidth(firstChild.offsetWidth);
            }
        };

        measureChildWidth();

        // Re-measure on window resize
        window.addEventListener('resize', measureChildWidth);
        return () => {
            window.removeEventListener('resize', measureChildWidth);
        };
    }, []);

    // Scroll handler with requestAnimationFrame for optimization
    const handleScroll = useCallback(() => {
        if (!containerRef.current || childWidth === 0) return;

        const container = containerRef.current;
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.offsetWidth;

        // Calculate the center position
        const centerPosition = scrollLeft + containerWidth / 2;

        // Determine which child is closest to the center
        let closestIndex = 0;
        let minDistance = Infinity;

        windows.forEach((_, index) => {
            const child = container.children[index] as HTMLElement;
            if (child) {
                const childCenter = child.offsetLeft + child.offsetWidth / 2;
                const distance = Math.abs(centerPosition - childCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            }
        });

        setActiveWindow(closestIndex);
    }, [childWidth, setActiveWindow, windows]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        container.addEventListener('scroll', onScroll);

        // Initial active window
        handleScroll();

        return () => {
            container.removeEventListener('scroll', onScroll);
        };
    }, [handleScroll]);

    return (
        <div className={styles.container} ref={containerRef}>
            {windows.map((WindowComponent, index) => (
                <WindowComponent key={index} isActive={index === activeWindow} />
            ))}
        </div>
    );
};

export default WindowCarrousel;
