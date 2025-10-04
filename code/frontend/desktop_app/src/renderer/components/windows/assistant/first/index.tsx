import styles from './styles.module.scss';
import { useRef, useState } from 'react';
import Anthropic from '@/components/logos/llm/anthropic';
import Meta from '@/components/logos/llm/meta';
import OpenAI from '@/components/logos/llm/openai';
import { createWebview } from '@/utils/webview';
import { useEffect } from 'react';
import Second from '../../search/second';


function First() {
    const [selectedLLM, setSelectedLLM] = useState<'openai' | 'meta' | 'anthropic'>('openai');
    const llmsRef = useRef<Map<string, Electron.WebviewTag>>(new Map());
    const llm_urls = {
        'openai': 'https://chatgpt.com',
        'meta': 'https://www.meta.ai/',
        'anthropic': 'https://claude.ai',
    };
    useEffect(() => {
        const llms = Object.keys(llm_urls) as Array<keyof typeof llm_urls>;
        llms.forEach((llm) => {
            const wv = createWebview(llm_urls[llm], llm);
            document.getElementById("webview-stash")?.appendChild(wv);
            llmsRef.current.set(llm, wv);
        });
    }, []);

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
            {selectedLLM && llmsRef.current.get(selectedLLM) && (
                <div className={`${styles.contentWrapper}`}>
                    <Second webview={llmsRef.current.get(selectedLLM)!} />
                </div>
            )}
        </div>
    )
};


export default First;
