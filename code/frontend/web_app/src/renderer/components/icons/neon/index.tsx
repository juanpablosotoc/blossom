import NeonImg from '@myAssets/neon/1.svg';

function Neon({className}: {className?: string}) {
    return <img src={NeonImg} alt="neon" className={className} />;
}

export default Neon;
