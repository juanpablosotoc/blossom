import OpenAI from '@myComponents/logos/llm/openai';
import styles from './styles.module.scss';
import Chevron from '@myComponents/icons/chevron';
import { useState } from 'react';
import GlowingCard from '@myComponents/glowingCard';
import RecommendationCard from '@myComponents/recommendationCard';
import BlossomImg from '@myComponents/blossomImg';
import ChatInput from '@myComponents/chatInput';
import LLM from './llm';
import Threads from './thread';


function First() {
    const [llmHovered, setLLMHovered] = useState(false);
    const [modalContent, setModalContent] = useState<'llm' | 'threads'>('llm');

    return (
        <div className={styles.container}>
            <div className={`${styles.top} ${modalContent === 'llm' ? styles.llmActive : styles.threadsActive}`}>
                <div className={styles.modalContent} onMouseLeave={() => setLLMHovered(false)}
                    onMouseEnter={() => modalContent === 'llm' && setLLMHovered(true)}>
                    {modalContent === 'llm' ? <LLM /> : <Threads />}
                </div>
                <div className={styles.llmButton} onMouseEnter={() => {
                    setLLMHovered(true)
                    setModalContent('llm');
                    }} onMouseLeave={() => setLLMHovered(false)}>
                    <OpenAI theme='light' size='small' />
                    <div className={styles.llmMetadata}>
                        <div className={styles.top}>
                            <h3>GPT-4o</h3>
                            <Chevron className={styles.chevron} direction='down' hasStem={true} hovered={llmHovered} />
                        </div>
                        <p>Great for most tasks</p>
                    </div>
                </div>
                <div className={styles.threadsContainer}
                onMouseEnter={() => setModalContent('threads')} >
                    <h5>Threads</h5>
                </div>
            </div>
            <div className={styles.blurryModal}></div>
            <div className={`${styles.darkModal}`}>
            </div>
            <div className={styles.middle}>
                <GlowingCard className={styles.glowingCard} bgImg={BlossomImg}>
                    <div className={styles.content}>
                        <h2>How can I help you today?</h2>
                        <div className={styles.recommendations}>
                            <RecommendationCard></RecommendationCard>
                            <RecommendationCard></RecommendationCard>
                            <RecommendationCard></RecommendationCard>
                        </div>
                    </div>
                </GlowingCard>  
            </div>
            <div className={styles.bottom}>
                <ChatInput hasFileUpload={true} theme='dark' />
            </div>
        </div>
    )
};


export default First;
