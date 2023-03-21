import { useState, useRef, useEffect } from "react";
import EntityBubble from "./EntityBubble";

export default function EntityContainer({ entity, collectedEntityId, entitiesReveal, index, onPopAnimation }) {
    const selfElementRef = useRef();
    const itemElementRef = useRef();
    const [ hovering, setHovering ] = useState(false);
    const [ inFront, setInFront ] = useState(false);
    const [ popAnim, setPopAnim ] = useState(false);
    const [ reveal, setReveal ] = useState(false);
    const [ upAnim, setUpAnim ] = useState(false);
    const [ bright, setBright ] = useState(false);

    useEffect(() => {
        if (reveal) setUpAnim(true);
    }, [reveal])

    useEffect(() => {
        setReveal(entitiesReveal[index]);
    }, [entitiesReveal, index])

    function HandleMouseEnter(e) {
        setHovering(true);
        setInFront(true);
    }

    function HandleMouseLeave(e) {
        setHovering(false);
    }

    function HandleTransitionEnd(e) {
        if (!hovering) setInFront(false);
    }

    function getChildIndex() {
        return Array.from(selfElementRef.current.parentNode.children).indexOf(selfElementRef.current);
    }

    function getParentChildCount() {
        return selfElementRef.current.parentElement.children.length;
    }

    function playPopAnimation() {
        if (!upAnim) setPopAnim(true);
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
            style={inFront ? { zIndex: 99 + getParentChildCount() - getChildIndex() } : null}
            className={composeClassName()}
            onAnimationEnd={handleAnimationEnd}
        >
            <EntityBubble entity={entity} playPopAnimation={playPopAnimation} collectedEntityId={collectedEntityId} />
            <div 
                ref={itemElementRef} 
                className='entity-item border-anim-hover'
                style={hovering ? {width: itemElementRef.current.scrollWidth + 'px' } : null} 
                onMouseEnter={HandleMouseEnter} 
                onMouseLeave={HandleMouseLeave}
                onTransitionEnd={HandleTransitionEnd}
            >
                <div 
                    className={'item-icon' + (entity.collected ? ' collected' : '')}
                    style={{ backgroundImage: `url(${hovering ? entity.iconAnimated : entity.icon})` }}
                ></div>

                <div className="tips">
                    <div>{entity.id}</div>
                    <div>{entity.name}</div>
                    <div>{entity.keyName}</div>
                </div>
            </div>
        </div>
    )
}