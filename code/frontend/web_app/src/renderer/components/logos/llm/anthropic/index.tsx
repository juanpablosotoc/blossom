import general from '../general.module.scss';
import AnthropicLargeSVG from '@myAssets/logos/anthropic_large.svg?react';
import AnthropicSmallSVG from '@myAssets/logos/anthropic.svg?react';


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
