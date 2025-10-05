import VideoAudioNav from '../videoAudioNav';
import styles from './styles.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { Line, Word } from '../../utils';

export default function Video(props: React.PropsWithChildren<{title: string, transcript: string, audioSrc: string}>) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const linesContainerRef = useRef<HTMLParagraphElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const lines: Array<Line> = [];
    const [currentPlayState, setCurrentPlayState] = useState<'playing' | 'paused'>('paused');
    const [followingLine, setFollowingLine] = useState<boolean>(true);
    let currentLine: Line = { wordCount: 0, text: '' };
    let prevWordEndTime = null;
    const [currentPlaybackSpeed, setCurrentPlaybackSpeed] = useState<string>('normal');
    const transcript = JSON.parse(props.transcript) as Array<Word>;


    for (let word of transcript) {
        if (currentLine.wordCount === 0) {
            currentLine.start = word.start;
        } else if (prevWordEndTime !== null && word.start - prevWordEndTime > 0.2) {
            currentLine.end = prevWordEndTime;
            lines.push(currentLine);
            currentLine = { wordCount: 0, text: '', start: word.start };
        }
        
        currentLine.wordCount++;
        currentLine.text += word.word + ' ';
        prevWordEndTime = word.end;

        if (currentLine.wordCount >= 8) {
            currentLine.end = word.end;
            lines.push(currentLine);
            currentLine = { wordCount: 0, text: '' };
        }
    }

    if (currentLine.wordCount > 0) {
        currentLine.end = prevWordEndTime!;
        lines.push(currentLine);
    }

    let timer: NodeJS.Timeout;

    function resetTimer() {
        clearTimeout(timer);
        wrapperRef.current!.classList.add(styles.showControls);

        timer = setTimeout(() => {
            wrapperRef.current!.classList.remove(styles.showControls);  
        }, 1000); 
    }

    useEffect(() => {
        const audio = audioRef.current;
        const updateTime = () => {
            // get the current play percentage
            const playPerc = (audio!.currentTime / audio!.duration) * 100;
            wrapperRef.current!.style.setProperty('--value', `${playPerc}%`)
            setCurrentTime(audio!.currentTime);
        };
        const updateDuration = () => {
            const audioDuration = audio!.duration;
            setDuration(audioDuration);
        };

        audio!.addEventListener('timeupdate', updateTime);
        audio!.addEventListener('loadedmetadata', updateDuration);


        document.addEventListener('mousemove', resetTimer);
        resetTimer(); // Initialize the timer when the page loads


        return () => {
            audio!.removeEventListener('timeupdate', updateTime);
            audio!.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    useEffect(() => {
        for (let i = 0; i < lines.length; i++) {
            if (currentTime >= lines[i].start! && currentTime <= lines[i].end!) {
                setCurrentLineIndex(i);
            }
        }
    }, [currentTime, lines]);
    

    function forwardNSeconds(n: number = 5) {
        setCurrentTime((prevTime) => {
            const newTime = prevTime + n;
            const audio = audioRef.current;
            if (audio) {
                audio.currentTime = newTime;
            }
            return newTime;
        });
    }
    
    function backwardNSeconds(n: number = 5) {
        setCurrentTime((prevTime) => {
            const newTime = prevTime - n;
            const audio = audioRef.current;
            if (audio) {
                audio.currentTime = newTime;
            }
            return newTime;
        });
    }
    const handleSeek = (e: any) => {
        const audio = audioRef.current;
        const seekTime = (e.target.value / 100) * duration;
        audio!.currentTime = seekTime;
        // set the value css proper
        // get the current play percentage
        const playPerc = (audio!.currentTime / duration) * 100;
        wrapperRef.current!.style.setProperty('--value', `${playPerc}%`)
        setCurrentTime(seekTime);
    };
    function play() {
        const audio = audioRef.current;
        audio!.play();
        setCurrentPlayState('playing');
    }
    function pause() {
        const audio = audioRef.current;
        audio!.pause();
        setCurrentPlayState('paused');
    }
    return (
        <div className={styles.video} ref={wrapperRef}>
            <div className={styles.over}>
                <p className={styles.title}>{props.title}</p>
                <VideoAudioNav pause={pause} play={play} forwardNSeconds={forwardNSeconds} backwardNSeconds={backwardNSeconds} currentPlayState={currentPlayState} currentTime={currentTime} handleSeek={handleSeek} setCurrentTime={setCurrentTime} duration={duration}></VideoAudioNav>
                <audio controls ref={audioRef} hidden onPlay={()=>{setCurrentPlayState('playing')}} onPause={()=>{setCurrentPlayState('paused')}}>
                    <source src={props.audioSrc} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            </div>
            <div className={styles.content} data-is-parent={true}>
            {React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
        // Access the start and end attributes from the child's props
        const start = child.props.start;
        const end = child.props.end;
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