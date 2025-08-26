import OpenAI from '@myComponents/logos/llm/openai';
import Gemini from '@myComponents/logos/llm/gemini';
import Anthropic from '@myComponents/logos/llm/anthropic';
import styles from './styles.module.scss';

function LLM() {
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <OpenAI theme='light' size='large'></OpenAI>
                <Gemini size='large'></Gemini>
                <Anthropic theme='light' size='large'></Anthropic>
            </div>
            <div className={styles.bottom}>
                <div className={styles.models}>
                    <p>o1-mini</p>
                    <p>o1-mini</p>
                    <p>o1-mini</p>
                </div>
                <div className={styles.models}>
                    <p>o1-mini</p>
                    <p>o1-mini</p>
                </div>
                <div className={styles.models}>
                    <p>o1-mini</p>
                </div>
            </div>
        </div>
    );
}

export default LLM;