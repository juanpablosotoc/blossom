import styles from './styles.module.scss';
import { ReactComponent as LinkSVG } from '@myAssets/icons/link.svg';


interface Props {
    theme: 'dark' | 'light';
}
function CircledLink(props: Props) {
    return (
        <div className={`${styles.wrapper} ${styles[props.theme]}`}>
            <LinkSVG />
        </div>
    )
};

export default CircledLink;