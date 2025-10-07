import React, { useEffect } from 'react';
import styles from './styles.module.css';
import VideoAudioNav from '../videoAudioNav';
import { getWordCount } from '../../utils';
import ErrorBoundary from '@/components/errorBoundary';

export default function SpeedReader(props: React.PropsWithChildren<{}>) {
    const [preFixation, setPreFixation] = React.useState<string>('');
    const [postFixation, setPostFixation] = React.useState<string>('');
    const [fixation, setFixation] = React.useState<string>('');
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [speed, setSpeed] = React.useState<number>(300); // Words per minute
    let elements = React.Children.toArray(props.children);
    // Split text nodes by white space or new line
    elements = elements.map((element) => {
        if (typeof element === 'string') {
            return element.split(/[\s\n]+/);
        }
        return element;
    }).flat();
    // Remove empty strings
    elements = elements.filter((element) => element !== '');
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    
    const timePerWord = 60 / speed; // Seconds per word
    let accumulatedTime = 0;
    // Calculate elementsWithTime and accumulatedTime
    const elementsWithTime = elements.map((element, index) => {
        let time;
        if (typeof element === 'string') {
            time = timePerWord * element.split(' ').length;
        } else if (React.isValidElement(element)) {
            const wordCount = getWordCount(element.props.children);
            time = timePerWord * wordCount;
        } else {
            time = timePerWord; // Assume it's one word
        }

        const result = {
            element,
            time,
            start: accumulatedTime
        };

        accumulatedTime += time;
        return result;
    });

    const [currentPlayState, setCurrentPlayState] = React.useState<'playing' | 'paused'>('paused');
    const [currentTime, setCurrentTime] = React.useState<number>(0);
    const [currentElementIndex, setCurrentElementIndex] = React.useState<number>(0);
    const [currentElementWord, setCurrentElementWord] = React.useState<string>('');
    
    function getFixationPoint(word: string): number {
        const length = word.length;
        if (length <= 2) return 0; // For very short words, the first character is the fixation point
        if (length <= 5) return 1; // For short words, the second character
        if (length <= 8) return 2; // For medium words, the third character
        return Math.floor(length / 4); // For longer words, use a quarter of the length as the fixation point
    }  

    useEffect(()=>{
        const fixationIndex = getFixationPoint(currentElementWord);
        const preFixation = currentElementWord.slice(0, fixationIndex);
        const fixationChar = currentElementWord[fixationIndex];
        const postFixation = currentElementWord.slice(fixationIndex + 1);
        console.log(preFixation, fixationChar, postFixation);
        setPreFixation(preFixation);
        setFixation(fixationChar);
        setPostFixation(postFixation);
    }, [currentElementWord])
    
    useEffect(() => {
        const text = elements[currentElementIndex];
        if (React.isValidElement(text)) {
            setCurrentElementWord(text.props.children.toString());
          }
           else if (typeof text === 'string') {
            setCurrentElementWord(text);
        }
      }, [currentElementIndex, elements]);
    // Function to handle play state
    function play() {
        // Reset to the beginning if the current time is at the end
        if (currentTime >= accumulatedTime) {
            setCurrentTime(0);
            setCurrentElementIndex(0);
        }
        setCurrentPlayState('playing'); 
    }

    // Function to handle pause state
    function pause() {
        setCurrentPlayState('paused');
    }

    // Function to handle seeking
    const handleSeek = (e: any) => {
        const seekTime = (e.target.value / 100) * accumulatedTime;
        
        setCurrentElementIndex(prevValue => {
            if (seekTime < elementsWithTime[0].start) {
                return 0;
            }
            for (let i = 0; i < elementsWithTime.length; i++) {
                const elementStart = elementsWithTime[i].start;
                const elementEnd = elementStart + elementsWithTime[i].time;

                if (elementStart <= seekTime && seekTime < elementEnd) {
                    return i;
                }
            }
            return elementsWithTime.length - 1;
        });

        const playPerc = (seekTime / accumulatedTime) * 100;
        wrapperRef.current!.style.setProperty('--value', `${playPerc}%`);
        setCurrentTime(seekTime);
    };

    // Function to move forward by n seconds
    function forwardNSeconds(n: number = 5) {
        setCurrentTime((prevTime) => {
            const newTime = Math.min(prevTime + n, accumulatedTime);
            const elementIndex = elementsWithTime.findIndex(element => element.start <= newTime && newTime < element.start + element.time);
            if (elementIndex !== -1) {
                setCurrentElementIndex(elementIndex);
            } else if (newTime >= accumulatedTime) {
                setCurrentElementIndex(elementsWithTime.length - 1);
            }
            const playPerc = (newTime / accumulatedTime) * 100;
            wrapperRef.current!.style.setProperty('--value', `${playPerc}%`);
            return newTime;
        });
    }

    // Function to move backward by n seconds
    function backwardNSeconds(n: number = 5) {
        setCurrentTime((prevTime) => {
            const newTime = Math.max(prevTime - n, 0);
            const elementIndex = elementsWithTime.findIndex(element => element.start <= newTime && newTime < element.start + element.time);
            if (elementIndex !== -1) {
                setCurrentElementIndex(elementIndex);
            } else if (newTime <= 0) {
                setCurrentElementIndex(0);
            }
            const playPerc = (newTime / accumulatedTime) * 100;
            wrapperRef.current!.style.setProperty('--value', `${playPerc}%`);
            return newTime;
        });
    }
    
    // UseEffect to handle the auto-play functionality
    useEffect(() => {
        if (currentPlayState === 'playing') {
            const timeoutId = setTimeout(() => {
                setCurrentTime((prevTime) => {
                    const newTime = prevTime + 0.1;
                    const elementIndex = elementsWithTime.findIndex(element => element.start <= newTime && newTime < element.start + element.time);
                    if (elementIndex !== -1) {
                        setCurrentElementIndex(elementIndex);
                    } else if (newTime >= accumulatedTime) {
                        setCurrentPlayState('paused');
                        return accumulatedTime;
                    }
                    const playPerc = (newTime / accumulatedTime) * 100;
                    wrapperRef.current!.style.setProperty('--value', `${playPerc}%`);
                    return newTime;
                });
            }, 50);
            return () => clearTimeout(timeoutId);
        } else {
            const playPerc = (currentTime / accumulatedTime) * 100;
            wrapperRef.current!.style.setProperty('--value', `${playPerc}%`);
        }
    }, [currentPlayState, currentTime]);

    return (
        <ErrorBoundary errorMessage="Error in SpeedReader component" onError={(error)=>{console.error(error)}}> 
        <div className={styles.wrapper} style={{'--preFixation': `'${preFixation}'`, '--postFixation': `'${postFixation}'`} as any} ref={wrapperRef}>
            <div className={styles.top}>
                <div className={styles.content} ref={contentRef}>  
                    <span className={styles.word}>
                        {fixation}
                    </span>
                </div>
                <div className={styles.playbackSpeedWrapper}>
                        <div className={styles.playbackSpeedInnerWrapper}>
                            <button onClick={(e)=>setSpeed(150)} className={speed === 150 ? styles.active : ''}>Gentle</button>
                            <button onClick={(e)=>setSpeed(200)} className={speed === 200 ? styles.active : ''}>Slow</button>
                            <button onClick={(e)=>setSpeed(250)} className={speed === 250 ? styles.active : ''}>Normal</button>
                            <button onClick={(e)=>setSpeed(300)} className={speed === 300 ? styles.active : ''}>Fast</button>
                            <button onClick={(e)=>setSpeed(350)} className={speed === 350 ? styles.active : ''}>Hyper</button>
                            <button onClick={(e)=>setSpeed(400)} className={speed === 400 ? styles.active : ''}>Ultra</button>
                        </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <VideoAudioNav className={styles.audioNav} forwardNSeconds={forwardNSeconds} backwardNSeconds={backwardNSeconds} handleSeek={handleSeek} setCurrentTime={setCurrentTime} pause={pause} play={play} currentPlayState={currentPlayState} currentTime={currentTime} duration={accumulatedTime}></VideoAudioNav>
            </div>
        </div>
        </ErrorBoundary>
    );
}
