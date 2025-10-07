import styles from '../styles.module.css';
import React, { useState, useEffect, useRef } from 'react';
import { Line } from '../../../utils';
import VideoAudioNav from '../../videoAudioNav';

interface AudioProps {
    title?: string;
}


export default function Audio(props: React.PropsWithChildren<AudioProps>) {
    // TODO: children is the words to be said in the audio to be generated

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const linesContainerRef = useRef<HTMLParagraphElement>(null);
    const [currentPlayState, setCurrentPlayState] = useState<'playing' | 'paused'>('paused');
    const [currentPlaybackSpeed, setCurrentPlaybackSpeed] = useState<string>('normal');
    const [transcriptSpans, setTranscriptSpans] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        // Get the text child
        const textChild = React.Children.toArray(props.children).find((child) => typeof child === 'string');
        if (textChild) {
            setTranscriptSpans(textChild.split(' ').map((word, index) => (
                <span key={index} className={index === 0 ? styles.highlight : ''} onClick={()=>{}}>
                    {word}
                </span>
            )));
        }
    }, [props.children]);
    
    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <div className={styles.content}>
                <p className={styles.transcript} ref={linesContainerRef}>
                    <div className={styles.titleWrapper}>
                        <p className={styles.title}>{props.title ? props.title : ''}</p>
                        <select>
                            <option>Alloy</option>
                            <option>Echo</option>
                            <option>Fable</option>
                            <option>Onyx</option>
                            <option>Nova</option>
                            <option>Shimmer</option>
                        </select>
                    </div>
                    {transcriptSpans}
                </p>
                <VideoAudioNav handleSeek={()=>{}} setCurrentTime={setCurrentTime} play={()=>{}} pause={()=>{}} currentTime={currentTime} duration={0} currentPlayState={currentPlayState} backwardNSeconds={()=>{}} forwardNSeconds={()=>{}} ></VideoAudioNav>
                {/* <audio controls ref={audioRef} hidden onPlay={()=>{setCurrentPlayState('playing')}} onPause={()=>{setCurrentPlayState('paused')}}>
                    <source src={src} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio> */}
            </div>
            <div className={styles.playbackSpeedWrapper}>
                <div className={styles.playbackSpeedInnerWrapper}>
                <p onClick={(e)=>setCurrentPlaybackSpeed('0.5')} className={currentPlaybackSpeed === '0.5' ? styles.active : ''}>0.5</p>
                <p onClick={(e)=>setCurrentPlaybackSpeed('normal')} className={currentPlaybackSpeed === 'normal' ? styles.active : ''}>Normal</p>
                <p onClick={(e)=>setCurrentPlaybackSpeed('1.5')} className={currentPlaybackSpeed === '1.5' ? styles.active : ''}>1.5</p>
                <p onClick={(e)=>setCurrentPlaybackSpeed('2')} className={currentPlaybackSpeed === '2' ? styles.active : ''}>2</p>
                </div>
            </div>
        </div>
    );
}
