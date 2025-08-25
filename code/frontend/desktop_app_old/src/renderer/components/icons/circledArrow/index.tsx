import { ReactComponent as Arrow } from '@myAssets/icons/arrow.svg';
import styles from './styles.module.scss';


interface Props {
  direction: 'up' | 'down';
  onClick: () => void;
  className?: string;
  size: 'small' | 'medium';
  theme: 'dark' | 'light';
}

export default function CircledArrow(props: Props) {
  return (
    <div className={`${styles.container} 
    ${props.className} 
    ${props.direction === 'up' ? styles.up : styles.down}
    ${props.size === 'small' ? styles.small : styles.medium}
    ${props.theme && styles[props.theme]}`}
    onClick={props.onClick}>
        <Arrow />
    </div>
  );
};
