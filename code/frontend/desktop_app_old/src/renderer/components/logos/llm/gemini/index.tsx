import general from '../general.module.scss';
import { ReactComponent as GeminiLargeSVG } from '@myAssets/logos/gemini_large.svg';
import { ReactComponent as GeminiSmallSVG } from '@myAssets/logos/gemini.svg';


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
