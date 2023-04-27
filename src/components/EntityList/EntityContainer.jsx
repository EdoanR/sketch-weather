import { useState, useRef, useEffect } from "react";
import EntityBubble from "./EntityBubble";

export default function EntityContainer({ entity, entitiesReveal, index, onPopAnimation }) {
    const selfElementRef = useRef();
    const itemElementRef = useRef();
    const [ hovering, setHovering ] = useState(false);
    const [ popAnim, setPopAnim ] = useState(false);
    const [ reveal, setReveal ] = useState(false);
    const [ upAnim, setUpAnim ] = useState(false);
    const [ bright, setBright ] = useState(entity.collected);

    useEffect(() => {
        if (reveal) setUpAnim(true);
    }, [reveal])

    useEffect(() => {
        setReveal(entitiesReveal[index]);
    }, [entitiesReveal, index])

    function HandleMouseEnter(e) {
        setHovering(true);
    }

    function HandleMouseLeave(e) {
        setHovering(false);
    }

    function playPopAnimation() {
        if (!upAnim && entitiesReveal.length) setPopAnim(true);
        setBright(true);
        onPopAnimation(entity);
    }

    function handleAnimationEnd(e) {
        if (e.animationName === 'entity-container-pop-anim') setPopAnim(false);
        if (e.animationName === 'up-anim') setUpAnim(false);
    }

    function composeClassName() {
        const classes = ['entity-container'];

        if (popAnim) classes.push('entity-pop-anim');
        if (reveal) classes.push('show');
        if (upAnim) classes.push('up-anim');
        if (bright) classes.push('bright');

        return classes.join(' ');
    }

    return (
        <div 
            ref={selfElementRef} 
            className={composeClassName()}
            onAnimationEnd={handleAnimationEnd}
        >
            <EntityBubble entity={entity} playPopAnimation={playPopAnimation} />
            <div 
                ref={itemElementRef} 
                className='entity-item border-anim-hover'
                onMouseEnter={HandleMouseEnter} 
                onMouseLeave={HandleMouseLeave}
                data-tooltip-id="tooltip"
                data-tooltip-content={entity.name}
            >
                <div 
                    className={'item-icon' + (entity.collected ? ' collected' : '')}
                    style={{ backgroundImage: `url(${hovering ? entity.iconAnimated : entity.icon})` }}
                ></div>

            </div>
        </div>
    )
}