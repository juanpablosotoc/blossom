import VideoAudioNav from '../../videoAudioNav';
import styles from '../styles.module.css';
import React, { useState } from 'react';


interface VideoProps {
    title: string;
    children: React.ReactElement<{start: number, end: number}>[];
}

export default function Video(props: React.PropsWithChildren<VideoProps>) {
    const currentTime = 0;
    const [currentPlayState, setCurrentPlayState] = useState<'playing' | 'paused'>('paused');

    return (
        <div className={styles.video}>
            <div className={styles.over}>
                <p className={styles.title}>{props.title}</p>
                <VideoAudioNav pause={()=>{}} play={()=>{}} 
                forwardNSeconds={()=>{}} 
                backwardNSeconds={()=>{}} 
                currentPlayState={currentPlayState} 
                currentTime={0} handleSeek={()=>{}} 
                setCurrentTime={()=>{}} duration={0}></VideoAudioNav>
                <audio controls hidden onPlay={()=>{}} onPause={()=>{}}>
                    <source type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            </div>
            <div className={styles.content} data-is-parent={true}>
            {React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
        // Access the start and end attributes from the child's props
        const start = (child.props as any).start;
        const end = (child.props as any).end;
        if (start && end) {
            // Check if the current time is within the start and end range
            if (currentTime >= start && currentTime <= end) {
                // Return the child with the active prop set to true
                return React.cloneElement(child, { 'isActive': true } as any);
            }
        }

        return React.cloneElement(child, { 'isActive': false } as any);; // Return the child as is if it's not a valid React element
        }})}
            </div>
        </div>
    );
}