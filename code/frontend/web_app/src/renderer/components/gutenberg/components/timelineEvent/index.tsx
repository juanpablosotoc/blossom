import styles from './styles.module.css';
import timelineStyles from '../timeline/styles.module.css';


import React, { useRef } from 'react';
import ErrorBoundary from '@/components/errorBoundary';


interface Props {
    date: string;
}

export default function TimelineEvent(props: React.PropsWithChildren<Props>) {
  const dateRef = useRef<HTMLParagraphElement>(null);
  const timelineEventRef = useRef<HTMLDivElement>(null);
  
  const handleActive = () => {
    // Remove active class from all other events
    document.querySelectorAll('.' + timelineStyles.active).forEach((element) => {
      element.classList.remove(timelineStyles.active);
    });

    // Add active class to the current events parent (the parent is found in the timeline component)
    timelineEventRef.current!?.parentElement?.classList.add(timelineStyles.active);
  };

  return (
    <ErrorBoundary errorMessage="Error in TimelineEvent component" onError={(error)=>{console.error(error)}}>
    <div className={styles.timelineEvent} ref={timelineEventRef}>
      <button onClick={handleActive} className={styles.dateButton}>
        <p ref={dateRef} className={styles.date}><span>{props.date}</span></p>
      </button>
      <div className={styles.content}  data-is-parent={true}>{props.children}</div>
    </div>
    </ErrorBoundary>
  );
}
