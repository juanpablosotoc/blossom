import Chevron from '../../icons/chevron';
import MyTooltip from '../mytooltip';
import styles from './styles.module.css';


interface Props {
    prompt: string;
    title: string;
}

export default function InfoLink(props: Props) {
    return (
        <div className={styles.wrapper}>
        <p>
            Learn more about "{props.title!.length >= 30 ? props.title!.slice(0, 30) + '...' : props.title}"
        </p>
        <MyTooltip>
                {props.prompt}
        </MyTooltip>
        <Chevron className={styles.chevron} stemClassName={styles.chevronStem}></Chevron>
        </div>
    )
};
