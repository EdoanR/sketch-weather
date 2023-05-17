import { useContext, useEffect, useRef, useState } from "react";
import { animated, easings, useSpring } from 'react-spring';
import { randNumber, wait } from "../../../utils";
import { EntitiesListContext } from "../../../contexts/EntitiesListContext";
import './index.scss';

export default function EntityBubble({ entity }) {

    const centerPos = { left: 10, top: 20 }
    const [ playing, setPlaying ] = useState(false);
    const [ posAnimation, posApi ] = useSpring(() => (centerPos));
    const [ scaleAnimation, scaleApi ] = useSpring(() => ({ scale: 1, display: 'none' }));
    const [ wooblyAnimation, wooblyApi ] = useSpring(() => ({ x: 0, y: 0 }));
    const { onBubbleEnd } = useContext( EntitiesListContext );
    const wooblyAnimRange = 3;

    const selfRef = useRef();

    useEffect(() => {

        if (entity.bubbleAnim) {
            startAnimation();
        } else {
            stopAnimation();
        }

    }, [entity.bubbleAnim]);

    function startAnimation() {
        setPlaying(true);

        posApi.start({
            from: getInitialPos(),
            to: async next => {
                await wait(2200);
                await next({ ...getTargetPos(), config: { duration: 2000, easing: easings.easeInOutSine  } });
            }
        });

        scaleApi.start({
            from: { scale: 0.9, display: 'none' },
            to: async next => {
                await next({ scale: 1.1, display: '', config: { duration: 100 } });
                await next({ scale: 1, config: { duration: 100 } });
                await next({ scale: 0, delay: 3000, config: { duration: 2000, easing: easings.easeInOutSine  }});
                await next({ display: 'none' });
                handleAnimationEnd();
            }
        });

        wooblyApi.start({
            from: { x: randNumber(wooblyAnimRange, wooblyAnimRange), y: randNumber(wooblyAnimRange, wooblyAnimRange)},
            to: async next => {
                while(true) {
                    await next({ 
                        x: randNumber(-wooblyAnimRange, wooblyAnimRange), 
                        y: randNumber(-wooblyAnimRange, wooblyAnimRange), 
                        config: { duration: 1000, easing: easings.easeInOutSine } 
                    });
                }
            },
            loop: true,
            cancel: !entity.bubbleAnim
        });

    }

    function stopAnimation() {
        posApi.stop();

        if (playing) {
            scaleApi.start({ 
                from: { scale: 1, display: '' },
                to: [
                    { scale: 1.1, config: { duration: 100 } },
                    { scale: 0.9, config: { duration: 100 } },
                    { display: 'none' },
                ]
            });
        } else {
            scaleApi.stop();
        }
        
        wooblyApi.stop();
        wooblyApi.start({ from: {x: 0, y: 0} });

        setPlaying(false);
    }

    function handleAnimationEnd() {
        onBubbleEnd(entity);
        stopAnimation();
    }

    function getInitialPos() {
        const element = document.querySelector(`.entity[keyname="${entity.keyName}"]`);
        const rect = element.getBoundingClientRect();

        return {
            left: rect.x + window.scrollX,
            top: rect.y + window.scrollY
        }
    }

    function getTargetPos() {
        const element = document.querySelector(`.entity-container[keyname="${entity.keyName}"]`);
        const rect = element.getBoundingClientRect();

        return {
            left: rect.x + 10 + window.scrollX,
            top: rect.y + 20 + window.scrollY
        }
    }

    return (
        <animated.div 
            ref={selfRef}
            className="bubble" 
            style={{ 
                ...posAnimation, 
                ...scaleAnimation, 
                ...wooblyAnimation 
            }}
        >
            <div style={{ backgroundImage: `url(${entity.iconAnimated})` }}></div>
        </animated.div>
    )
}