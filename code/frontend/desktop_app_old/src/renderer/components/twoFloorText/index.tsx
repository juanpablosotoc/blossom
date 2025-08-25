import styles from './styles.module.scss';


interface Props {
    text: string;
    hovered: boolean;
}

function TwoFloorText(props: Props) {
    return (
        <div className={styles.wrapper + ' ' + (props.hovered ? styles.hovered : '')} >
            <p>{props.text}</p>
            <p>{props.text}</p>
        </div>
    )
};


export default TwoFloorText;