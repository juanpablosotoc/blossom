import general from '../general.module.scss';
import GeminiLargeSVG from '@myAssets/logos/gemini_large.svg?react';
import GeminiSmallSVG from '@myAssets/logos/gemini.svg?react';


interface Props {
    className?: string;
    size: 'small' | 'large';
}

function Gemini(props: Props) {
    return (
        <>
            {props.size === 'small' ? (
                <GeminiSmallSVG className={`${general.logo} ${props.className} ${general.small}`} />
            ) : (
                <GeminiLargeSVG className={`${general.logo} ${props.className} ${general.large}`} />
            )}
        </>
    );
}

export default Gemini;
