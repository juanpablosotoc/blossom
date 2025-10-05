import { useEffect, useRef, useState } from 'react';
import general from '../general.module.scss';
import styles from './styles.module.scss';
import Blossom from '@myComponents/logos/blossom';
import img1 from '@myAssets/images/1.jpg';
import imgProfilePic from '@myAssets/images/profile.png';

interface Props {
    isActive: boolean;
};

function BlossomGarden({ isActive }: Props) {

    const pointerCanvas = useRef<HTMLDivElement>(null);
    const [squareOpacities, setSquareOpacities] = useState<number[]>([]);
    const [lastY, setLastY] = useState<number>(null);
    const itemsContainer = useRef<HTMLDivElement>(null);

    const [discovering, setDiscovering] = useState<boolean>(false);

    function setXYOffset(x: number = 0, y: number = 0) {
        const width = itemsContainer.current?.offsetWidth;
        
        const stepSize = width / 20;
    
        const xOffsetSquares = Math.round(x / stepSize);
        const yOffsetSquares = Math.round(y / stepSize);
    
        const xOffset = xOffsetSquares * stepSize;
        const yOffset = yOffsetSquares * stepSize;
    
        const prevLeft = pointerCanvas.current?.style.left;
        const prevTop = pointerCanvas.current?.style.top;
    
        if (prevLeft !== `${xOffset}px` || prevTop !== `${yOffset}px`) {
            if (x) pointerCanvas.current.style.left = `${xOffset}px`;
            if (y) pointerCanvas.current.style.top = `${yOffset}px`;
        }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const { clientX, clientY } = e;
        const target = e.currentTarget;
        const { left, top } = target.getBoundingClientRect();
        const scrollTop = itemsContainer.current?.parentElement?.scrollTop;
        const x = clientX - left;
        const y = clientY - top + scrollTop;
        setLastY(clientY - top);
        
        setXYOffset(x, y);
    }

    function handleScroll(e: React.UIEvent<HTMLDivElement>) {
        const { scrollTop } = e.currentTarget;
        // get the x and y of the mouse
        const addedY = scrollTop + (lastY ? lastY : 0);

        setXYOffset(0, addedY);
    }

/**
 * Generates or updates the opacities for a 9x9 grid of squares.
 * - Central 3x3 squares always have an opacity of 1.
 * - Other squares have opacities based on their distance from the center, with optional random variations.
 *
 * @param prevSquareOpacities - Previous opacities of the squares.
 * @returns Updated array of opacities for the squares.
 */
function generateSquares(prevSquareOpacities: number[] = []): number[] {
    const exponent = 1;
    const gridSize = 10;
    const center = (gridSize - 1) / 2; // 4.5 for a 10x10 grid (0-based indexing)
    // const maxDistance = Math.sqrt(2) * center; // Maximum Euclidean distance from center
    const maxDistance = 4;
    const newSquareOpacities: number[] = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // Calculate distance from the center
        const distance = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));

        // Determine if the square is within the central 2x2 area
        const isCentral = (row === Math.floor(center) || row === Math.ceil(center)) && (col === Math.floor(center) || col === Math.ceil(center));

        if (isCentral) {
            // Central 3x3 squares have full opacity
            newSquareOpacities.push(1 + (Math.random() * 0.2 - 0.1));
        } else {
            if (prevSquareOpacities.length === 0) {
                // **Initialization Phase:**
                // Opacity inversely proportional to distance (closer = higher opacity)
                const normalizedDistance = distance / maxDistance;
                let opacity = (1 - Math.pow(normalizedDistance, exponent)) + (Math.random() * 0.3 - 0.15); // ±0.15 variation                // Clamp opacity between 0.2 and 0.8 to ensure visibility
                // const clampedOpacity = Math.min(Math.max(opacity, 0.2), 0.8);
                newSquareOpacities.push(opacity);
            } else {
                // **Update Phase:**
                // Modify existing opacity slightly
                const prevOpacity = prevSquareOpacities[i];
                let newOpacity = prevOpacity + (Math.random() * 0.2 - 0.1); // Change by ±0.1

                // Ensure opacity remains within bounds based on distance
                const normalizedDistance = distance / maxDistance;
                const targetOpacity = 1 - Math.pow(normalizedDistance, exponent);
                const minOpacity = Math.max(targetOpacity - 0.1, 0); // Allow slight variation below target
                const maxOpacity = Math.min(targetOpacity + 0.1, 1); // Allow slight variation above target

                // Clamp the new opacity within the allowed range
                newOpacity = Math.min(Math.max(newOpacity, minOpacity), maxOpacity);

                newSquareOpacities.push(newOpacity);
            }
        }
    }

    return newSquareOpacities;
}


    useEffect(()=>{
        setSquareOpacities(generateSquares());

        const interval = setInterval(()=>{
            // 1 in 2 chance to generate a new square
            if (Math.random() < 0.5) {
                setSquareOpacities((prevValue) => {
                    return generateSquares(prevValue);
                })
            }
        }, 300) 

        // set the wrappers maxheight so the overflow doesnt scroll infinetly
        const wrapper = itemsContainer.current;
        const height = wrapper.scrollHeight;
        wrapper.style.height = `${height}px`;
        
        return () => {
            clearInterval(interval);
        }
    }, [])
    
    
    return (
        <div className={`${general.window} 
        ${isActive ? general.active : ''} 
        ${discovering ? styles.discovering : ''}
        ${styles.container}`}
        >
            <div className={styles.preview}>
                <div className={styles.top}>
                    <Blossom size='small' theme='dark' />
                    <h2>For You</h2>
                    <p className={styles.comingSoon}>(Coming Soon)</p>
                </div>
                
            </div>
            <div className={styles.discover}
            onMouseMove={handleMouseMove} 
            onScroll={handleScroll}
            onMouseEnter={()=>setDiscovering(true)}
            onMouseLeave={()=>setDiscovering(false)}>
                <div ref={itemsContainer} className={styles.itemsContainer}>
                    <div ref={pointerCanvas} className={styles.pointerCanvas}>
                        {squareOpacities.map((opacity, index) => (
                            <div key={index} className={styles.square} style={{ opacity: opacity < 0.2 ? 0 : opacity }} />
                        ))}
                    </div>
                    <div className={styles.items}>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <img src={img1} alt="" />
                            <div className={styles.metadata}>
                                <img src={imgProfilePic} alt="" /> 
                                <div className={styles.textMetadata}>
                                    <p>Title</p>
                                    <p>@username</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlossomGarden;