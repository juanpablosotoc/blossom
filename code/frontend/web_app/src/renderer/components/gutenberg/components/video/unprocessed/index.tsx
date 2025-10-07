import VideoAudioNav from '../../videoAudioNav';
import styles from '../styles.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import Audio from '../../audio/unprocessed';
import { Line, Word } from '../../../utils';
import ErrorBoundary from '@/components/errorBoundary';
import Frame from '../../frame';
import VideoAudio from '../../VideoAudio';
import { generateAudio } from '@/utils/message';

// export default function Video(props: React.PropsWithChildren<{title: string}>) {
//     const wrapperRef = useRef<HTMLDivElement>(null);
//     const [currentPlayState, setCurrentPlayState] = useState<'playing' | 'paused'>('paused');

//     useEffect(() => {
//         const FrameElements =  React.Children.toArray(props.children).filter((child) => React.isValidElement(child) && child.type === Frame);
//         const VideoAudioElements =  React.Children.toArray(FrameElements).filter((child) => React.isValidElement(child) && child.type === VideoAudio);
//         for (const i = 0; i < VideoAudioElements.length; i++) {
//             const VideoAudioElement = VideoAudioElements[i];
//             const FrameElement = FrameElements[i];

//             const textChild = React.Children.toArray(VideoAudioElement.props.children).find((child) => typeof child === 'string');
//             if (textChild) {
//                 generateAudio(textChild).then((res)=>{
//                     console.log("Processed audio response: ", res);

//                     // setHaveProcessedAudio(true);
//                     // setProcessedAudioSrc(res.audio_src);
//                     // setProcessedAudioTranscript(res.transcript);
//                 });
//             }
//         }
//     }, [props.children]);
//     return (
//         <ErrorBoundary errorMessage="Error in Video component" onError={(error)=>{console.error(error)}}>  
//         <div className={styles.video} ref={wrapperRef}>
//             <div className={styles.over}>
//                 <p className={styles.title}>{props.title}</p>
//                 <VideoAudioNav pause={()=>{}} play={()=>{}} forwardNSeconds={()=>{}} backwardNSeconds={()=>{}} currentPlayState={currentPlayState} currentTime={0} handleSeek={()=>{}} setCurrentTime={()=>{}} duration={0}></VideoAudioNav>
//             </div>
//             <div className={styles.content + " " + styles.shimmer} data-is-parent={true}>
//             {React.Children.map(props.children, (child) => {
//     if (React.isValidElement(child)) {
//         return React.cloneElement(child, { 'isActive': false } as any);; // Return the child as is if it's not a valid React element
//         }})}
//             </div>
//         </div>
//         </ErrorBoundary>
//     );
// }

export default function Video(props: React.PropsWithChildren<{title: string}>) {
    return (
        <ErrorBoundary errorMessage="Error in Video component" onError={(error)=>{console.error(error)}}>  
        <Audio title={props.title}>{props.children}</Audio>
        </ErrorBoundary>
    )
}