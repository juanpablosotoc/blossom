import styles from './styles.module.scss';
import { useState } from 'react';
import Anthropic from '@/components/logos/llm/anthropic';
import Meta from '@/components/logos/llm/meta';
import OpenAI from '@/components/logos/llm/openai';
import Blossom from '@/components/logos/blossom';


function First() {
    const [selectedLLM, setSelectedLLM] = useState<'openai' | 'meta' | 'anthropic'>('openai');

    return (
        <div className={styles.container}>
            <div className={styles.llms}>
                <div className={styles.llmWrapper + ' ' + (selectedLLM === 'openai' ? styles.active : '')} onClick={() => setSelectedLLM('openai')}>
                    <OpenAI theme='light' size='large'></OpenAI>
                </div>
                <div className={styles.llmWrapper + ' ' + (selectedLLM === 'meta' ? styles.active : '')} onClick={() => setSelectedLLM('meta')}>
                    <Meta size='large'></Meta>
                </div>
                <div className={styles.llmWrapper + ' ' + (selectedLLM === 'anthropic' ? styles.active : '')} onClick={() => setSelectedLLM('anthropic')}>
                    <Anthropic theme='light' size='large'></Anthropic>
                </div>
            </div>
            <div className={`${styles.contentWrapper}`}>
                {/* <Second webview={llmsRef.current.get(selectedLLM)!} /> */}
                <div>
                    <Blossom size='small' theme='light' className={styles.blossom} />
                    <p>Download Blossom to continue...</p>
                </div>
            </div>
        </div>
    )
};


export default First;
