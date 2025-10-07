import { useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import styles from './styles.module.css';
import ErrorBoundary from '@/components/errorBoundary';

export default function MyTooltip(props: React.PropsWithChildren<{}>) {
    const childrenString = props.children?.toString();
    // generate a random string for the id
    const id = Math.random().toString(36).substring(7);
    const spanRef = useRef<any>(null); 
    useEffect(()=>{
        // set the parents data-tooltip-id="my-tooltip" data-tooltip-content="Hello world!"
        spanRef.current?.parentElement.setAttribute('data-tooltip-id', id);
        spanRef.current?.parentElement.setAttribute('data-tooltip-content', childrenString);
    }, [])
    return (
        <ErrorBoundary errorMessage="Error in MyTooltip component" onError={(error)=>{console.error(error)}}>
        <Tooltip id={id} className={styles.tooltip}></Tooltip>
        <span style={{visibility: 'hidden'}} ref={spanRef}></span>
        </ErrorBoundary>
    );
}

