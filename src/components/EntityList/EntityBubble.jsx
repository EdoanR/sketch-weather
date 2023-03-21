import { useEffect, useRef, useState } from "react";
import './EntityBubble.scss';

export default function EntityBubble({ entity, playPopAnimation, collectedEntityId }) {

    const selfElementRef = useRef();
    const [ hidden, setHidden ] = useState(true);
    const [ shrink, setShrink ] = useState(false);
    const [ spawned, setSpawned ] = useState(false);
    const [ spawnAnim, setSpawnAnim ] = useState(false);
    const [ pos, setPos ] = useState({ top: 0, left: 0 })

    useEffect(() => {

        function spawn() {
            const entityElement = document.querySelector('.entity-' + entity.keyName);
            if (!entityElement) return console.log(`Entity element for bubble was not found.`, entity.keyName);
    
            setSpawned(true);
            setSpawnAnim(true);

            const parentRect = selfElementRef.current.parentElement.getBoundingClientRect(); 
            const entityRect = entityElement.getBoundingClientRect();
    
            setPos({
                left: entityRect.left - parentRect.left,
                top: entityRect.top - parentRect.top
            });
            
            setHidden(false);
    
            setTimeout(() => {
                setPos({
                    left: parentRect.width / 2,
                    top: parentRect.height / 2
                });
    
                setTimeout(() => {
                    setShrink(true);
    
                    setTimeout(() => {
                        setHidden(true);
                        setShrink(false);
                        playPopAnimation();
                    }, 1900);
                }, 1000);
            }, 1000);
        }

        if (collectedEntityId === entity.id && !spawned) spawn();

    }, [collectedEntityId, entity.id, entity.keyName, spawned]);

    function composeClassName() {
        const classes = ['bubble'];
        if (hidden) classes.push('hidden');
        if (shrink) classes.push('shrink');
        if (spawnAnim) classes.push('spawn-anim');

        return classes.join(' ');
    }

    function handleAnimationEnd(e) {
        if (e.animationName === 'bubble-spawn') setSpawnAnim(false);
    }

    return (
        <div 
            ref={selfElementRef}
            className={composeClassName()}
            onAnimationEnd={handleAnimationEnd}
            style={{
                top: pos.top + 'px',
                left: pos.left + 'px'
            }}
        >
            <div style={{ backgroundImage: `url(${entity.iconAnimated})` }}></div>
        </div>
    )
}