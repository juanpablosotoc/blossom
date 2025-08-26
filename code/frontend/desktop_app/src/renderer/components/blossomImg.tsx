import image from "@myAssets/images/1.jpg";


export default function BlossomImg(props: {className?: string}) {
    return (
        <img src={image} className={props.className} alt="Beutiful image" />
    )
};