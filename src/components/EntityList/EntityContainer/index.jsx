import { useState, useRef, useEffect, useContext } from "react";
import EntityBubble from "../EntityBubble";
import { EntitiesContext } from "../../../contexts/EntitiesContext";
import './index.scss';

export default function EntityContainer({ entity }) {
    
    const [ hovering, setHovering ] = useState(false);

    function composeClassName() {
        const classes = ['entity-container'];
        
        if (entity.reveal) classes.push('show');
        if (entity.pop) classes.push('pop-anim');
        if (entity.bright) classes.push('bright');

        return classes.join(' ');
    }

    return (
        <div className={composeClassName()} keyname={entity.keyName} >
            <div 
                className='entity-item border-anim-hover'
                data-tooltip-id="tooltip"
                data-tooltip-content={entity.name}
                onMouseEnter={() => { setHovering(true) }}
                onMouseLeave={() => { setHovering(false) }}
            >
                <div 
                    className='item-icon'
                    style={{ backgroundImage: `url(${hovering ? entity.iconAnimated : entity.icon})` }}
                ></div>
            </div>
        </div>
    )
}