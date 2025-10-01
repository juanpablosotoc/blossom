import general from '../general.module.scss';
import styles from './styles.module.scss';
import First from './first';
import Second from './second';
import SideCircles from '../sideCircles';
import { useEffect, useRef, useState } from 'react';


interface Props {
    isActive: boolean;
};

function Search({ isActive }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCircle, setActiveCircle] = useState(0);
  
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
  
      let ticking = false;
  
      const updateActive = () => {
        const { scrollTop, clientHeight } = container;
        const viewportCenter = scrollTop + clientHeight / 2;
  
        let closestIdx = 0;
        let minDist = Infinity;
        const children = Array.from(container.children) as HTMLElement[];
  
        for (let i = 0; i < children.length; i++) {
          const el = children[i];
          const center = el.offsetTop + el.offsetHeight / 2;
          const dist = Math.abs(viewportCenter - center);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = i;
          }
        }
  
        setActiveCircle(closestIdx);
      };
  
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            updateActive();
            ticking = false;
          });
          ticking = true;
        }
      };
  
      // Initial calculation and listeners
      updateActive();
      container.addEventListener("scroll", onScroll, { passive: true });
  
      // Optional: re-calc on resize in case heights change
      const onResize = () => updateActive();
      window.addEventListener("resize", onResize);
  
      return () => {
        container.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }, []);

    return (
        <div className={`${general.window} ${styles.container} ${isActive ? general.active : ''}`}>
            <SideCircles circleCount={2} activeCircle={activeCircle} isActive={isActive} />
            <div className={styles.wrapper}
            ref={containerRef}>
                <div className={styles.firstWrapper}>
                    <First />
                </div>
                <div className={styles.secondWrapper}>
                    <Second url="https://www.youtube.com" />
                </div>
            </div>
        </div>
    );
};


export default Search;

