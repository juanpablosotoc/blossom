import styles from './styles.module.css';
import Backward from '../../icons/backward';
import Forward from '../../icons/forward';
import Pause from '../../icons/pause';
import Play from '../../icons/play';
import { useRef } from 'react';
import ErrorBoundary from '@/components/errorBoundary';


interface Props {
    currentTime: number;
    duration: number;
    currentPlayState: 'playing' | 'paused';
    backwardNSeconds: () => void;
    forwardNSeconds: () => void;
    className?: string;
    setCurrentTime: (time: number) => void;
    play: () => void;
    pause: () => void;
    handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function VideoAudioNav(props: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    return (
        <ErrorBoundary errorMessage="Error in VideoAudioNav component" onError={(error)=>{console.error(error)}}>  
    <div className={styles.wrapper + ' ' + (props.className ? props.className : '')} ref={wrapperRef}>
        <div className={styles.buttons}>
            <button onClick={(e)=>props.backwardNSeconds()}>
                <Backward className={styles.forwardBackward}></Backward>
            </button>
            <button className={styles.playPause} onClick={(e)=>{
                    props.currentPlayState === 'playing' ? props.pause() : props.play();
                }}>

                <Play className={props.currentPlayState === 'playing' ? '' : styles.active}></Play>
                <Pause className={props.currentPlayState === 'paused' ? '': styles.active}></Pause>
            </button>
            <button onClick={(e)=>props.forwardNSeconds()}>
                <Forward className={styles.forwardBackward}></Forward>
            </button>
        </div>
        <div className={styles.sliderWrapper}>
            <span className={styles.timeMetadata}>{formatTime(props.currentTime)}</span>
            <input
                type="range"
                min="0"
                max="100"
                value={(props.currentTime / props.duration) * 100 || 0}
                onChange={props.handleSeek}
                className={styles.sliderInput}
            />
            <span className={styles.timeMetadata}>{formatTime(props.duration)}</span>
        </div>
    </div>
    </ErrorBoundary>
    )
};
