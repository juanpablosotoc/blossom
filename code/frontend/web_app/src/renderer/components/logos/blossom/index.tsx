import styles from './styles.module.scss';
import BlossomSVG from '@myAssets/logos/blossom.svg?react';


interface Props {
    theme: 'light' | 'dark';
    className?: string;
    size: 'small' | 'large';
}

export default function Blossom(props: Props) {
    return (
        <div className={`
            ${styles.blossom} 
            ${props.className} 
            ${props.theme === 'light' ? styles.light : styles.dark} 
        `}>
            <BlossomSVG />
            {props.size === 'large' && (
                <h1>Blossom</h1>
            )}
        </div>
    );
};
