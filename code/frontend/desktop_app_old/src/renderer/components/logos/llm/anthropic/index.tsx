import general from '../general.module.scss';
import { ReactComponent as AnthropicLargeSVG } from '@myAssets/logos/anthropic_large.svg';
import { ReactComponent as AnthropicSmallSVG } from '@myAssets/logos/anthropic.svg';


interface Props {
    theme: 'light' | 'dark';
    className?: string;
    size: 'small' | 'large';
}


function Anthropic(props: Props) {
    return (
        <>
            {props.size === 'small' ? (
                <AnthropicSmallSVG className={`${general.logo} ${props.className} ${general.small} ${props.theme === 'light' ? general.light : general.dark}`} />
            ) : (
                <AnthropicLargeSVG className={`${general.logo} ${props.className} ${general.large} ${props.theme === 'light' ? general.light : general.dark}`} />
            )}
        </>
    );
}

export default Anthropic;
