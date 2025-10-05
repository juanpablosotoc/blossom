import styles from './styles.module.scss';
import LinkSVG from '@myAssets/icons/link.svg?react';


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