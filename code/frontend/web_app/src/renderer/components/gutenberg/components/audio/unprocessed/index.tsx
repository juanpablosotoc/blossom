import styles from '../styles.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import VideoAudioNav from '../../videoAudioNav';
import { generateAudio } from '../../../../../utils/message';
import ProcessedAudio from '../index';
import ErrorBoundary from '@/components/errorBoundary';


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
    const [haveProcessedAudio, setHaveProcessedAudio] = useState<boolean>(false);
    const [processedAudioSrc, setProcessedAudioSrc] = useState<string>('');
    const [processedAudioTranscript, setProcessedAudioTranscript] = useState<string>('');
    const [errorProcessingAudio, setErrorProcessingAudio] = useState<boolean>(false);

    const fallbackRender = () => {
        return (
            <div className={styles.wrapper} ref={wrapperRef}>
            <div className={styles.content}>
                <p className={styles.transcript + " " + styles.shimmer} ref={linesContainerRef}>
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
    };

    useEffect(() => {
        // Set the visuals----------------------------
        const textChild = React.Children.toArray(props.children).find((child) => typeof child === 'string');
        if (textChild) {
            // Split text every 3 words
            const words = textChild.split(' ');
            const wordsChunks = [];
            for (let i = 0; i < words.length; i += 3) {
                wordsChunks.push(words.slice(i, i + 3).join(' '));
            }
            setTranscriptSpans(wordsChunks.map((word, index) => (
                <span key={index} className={index === 0 ? styles.highlight : ''} onClick={()=>{}}>
                    {word}
                </span>
            )));
        }
        //--------------------------------------------
        if (textChild) {
            generateAudio(textChild).then((res)=>{
                console.log("Processed audio response: ", res);

                setHaveProcessedAudio(true);
                setProcessedAudioSrc(res.audio_src);
                setProcessedAudioTranscript(res.transcript);
            }).catch((err)=>{
                console.error("Error processing audio: ", err);
                setErrorProcessingAudio(true);
            });
        }
    }, [props.children]);
    
    return (
        <ErrorBoundary errorMessage="Error in Audio component" onError={(error)=>{console.error(error)}} fallbackRender={fallbackRender}>  
        {haveProcessedAudio && !errorProcessingAudio ? (
        <ProcessedAudio src={processedAudioSrc} transcript={processedAudioTranscript as any} title={props.title} />
    ) : (
        fallbackRender()
    )}
    </ErrorBoundary>
    );
}
