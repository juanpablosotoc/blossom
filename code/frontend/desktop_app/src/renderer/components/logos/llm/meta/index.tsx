import general from '../general.module.scss';
import { ReactComponent as MetaSVG } from '@myAssets/logos/meta.svg';

interface Props {
    className?: string;
    size: 'small' | 'large';
}


function OpenAI(props: Props) {
    return (
        <>
                <MetaSVG className={`${general.logo} 
                ${props.className} 
                ${props.size === 'small' ? general.small : general.large}
                `} 
                style={{ color: 'var(--white-900)' }}
                />
        </>
    );
}

export default OpenAI;
