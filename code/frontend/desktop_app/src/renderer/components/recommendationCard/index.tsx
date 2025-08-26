import Magic from '@myComponents/icons/magic';
import styles from './styles.module.scss';
import { PropsWithChildren } from 'react';


export default function RecommendationCard(props: PropsWithChildren<{className?: string}>) {
    return (
        <div className={`${styles.wrapper} ${props.className}`}>
            <Magic></Magic>
            <div>
                <p className='par-m'>Recommendation</p>
                <p className='par-s'>Description</p>
            </div>
        </div>
    )
};
