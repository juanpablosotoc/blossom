import CircledArrow from '@myComponents/icons/circledArrow';
import CircledLink from '@myComponents/icons/circledLink';
import styles from './styles.module.scss';
import { useRef } from 'react';


interface Props {
    hasFileUpload: boolean;
    className?: string;
    theme: 'dark' | 'light';
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
    onSubmit?: (question: string) => void;
    ref?: React.RefObject<HTMLInputElement>;
}


function ChatInput(props: Props) {
    const labelText = props.placeholder || 'Message ChatGPT';
    const submitBtnRef = useRef<HTMLDivElement>(null);

    function handleSubmit() {
        const question = props.ref!.current!.value;
        // empty input
        props.ref!.current!.value = '';
        // unfocus the input
        props.ref!.current!.blur();
        props.onSubmit?.(question);
    }

    // On enter new line, submit
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitBtnRef.current?.click();
        }
    }

    return (
        <div className={`${props.className} ${styles.wrapper} ${props.theme && styles[props.theme]}`}>
            {props.hasFileUpload && (
            <div>
                <input type='file' hidden/>
                <CircledLink theme={props.theme}></CircledLink>
            </div>
            )}
            <input type="text" ref={props.ref} placeholder={labelText} onFocus={props.onFocus} onBlur={props.onBlur} onKeyDown={handleKeyDown} />
            <div className={styles.submitBtn} ref={submitBtnRef} onClick={handleSubmit}>
                <CircledArrow direction='up' size='medium' theme={props.theme} onClick={() => {}}></CircledArrow>
            </div>
        </div>
    )
};


export default ChatInput;
