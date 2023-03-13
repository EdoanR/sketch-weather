import { useState, useRef } from "react";

export default function EntityContainer({ entity }) {
    const selfElementRef = useRef();
    const itemElementRef = useRef();
    const [ hovering, setHovering ] = useState(false);
    const [ inFront, setInFront ] = useState(false);


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

    return (
        <div 
            ref={selfElementRef} 
            style={inFront ? { zIndex: 99 + getParentChildCount() - getChildIndex() } : null}
            className='entity-container'
        >
            <div 
                ref={itemElementRef} 
                className='entity-item border-anim-hover'
                style={hovering ? {width: itemElementRef.current.scrollWidth + 'px' } : null} 
                onMouseEnter={HandleMouseEnter} 
                onMouseLeave={HandleMouseLeave}
                onTransitionEnd={HandleTransitionEnd}
            >
                <div className={'item-icon item-' + entity.keyName + (entity.collected ? ' collected' : '')}></div>
                <div className="tips">
                    <div>{entity.id}</div>
                    <div>{entity.name}</div>
                    <div>{entity.keyName}</div>
                </div>
            </div>
        </div>
    )
}