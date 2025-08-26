import general from '../general.module.scss';
import { ReactComponent as OpenAISmallSVG } from '@myAssets/logos/openai.svg';
import { ReactComponent as OpenAILargeSVG } from '@myAssets/logos/openai_large.svg';


interface Props {
    theme: 'light' | 'dark';
    className?: string;
    size: 'small' | 'large';
}


function OpenAI(props: Props) {
    return (
        <>
            {props.size === 'small' ? (
                <OpenAISmallSVG className={`${general.logo} 
                ${props.className} 
                ${props.theme === 'light' ? general.light : general.dark}
                ${general.small}`} />
            ) : (
                <OpenAILargeSVG className={`${general.logo} 
                ${props.className} 
                ${props.theme === 'light' ? general.light : general.dark}
                ${general.large}`} />
            )}
        </>
    );
}

export default OpenAI;
