import CircledArrow from '@myComponents/icons/circledArrow';
import CircledLink from '@myComponents/icons/circledLink';
import styles from './styles.module.scss';


interface Props {
    hasFileUpload: boolean;
    className?: string;
    theme: 'dark' | 'light';
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
}


function ChatInput(props: Props) {
    const labelText = props.placeholder || 'Message ChatGPT';
    return (
        <div className={`${props.className} ${styles.wrapper} ${props.theme && styles[props.theme]}`}>
            {props.hasFileUpload && (
            <div>
                <input type='file' hidden/>
                <CircledLink theme={props.theme}></CircledLink>
            </div>
            )}
            <input type="text" placeholder={labelText} onFocus={props.onFocus} onBlur={props.onBlur} />
            <div className={styles.submitBtn}>
                <CircledArrow direction='up' size='medium' theme={props.theme} onClick={() => {}}></CircledArrow>
            </div>
        </div>
    )
};


export default ChatInput;
