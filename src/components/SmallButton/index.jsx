import { useState } from "react"
import './index.scss';

export default function SmallButton(props) {
    const [currentIcon, setCurrentIcon] = useState(props.icon || props.animatedicon);

    function handleMouseEnter(e) {
        if (props.onMouseEnter) props.onMouseEnter(e);
        if (!props.animatedicon) return;
        
        setCurrentIcon(props.animatedicon);
    }

    function handleMouseLeave(e) {
        if (props.onMouseLeave) props.onMouseLeave(e);
        if (!props.icon) return;

        setCurrentIcon(props.icon);
    }

    return (
        <button 
            {...props}
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            data-tooltip-id={props.tooltip ? 'tooltip' : null} 
            data-tooltip-content={props.tooltip || null} 
            className="small-button border-anim-hover"
        >
            {props.icon || props.animatedicon ? (
                <div
                className="icon"
                style={{ backgroundImage: `url(${currentIcon})` }}
                ></div>
            ) : (
                <div className="content">{props.content}</div>
            )}
            {props.children}
        </button>
    )
    
}