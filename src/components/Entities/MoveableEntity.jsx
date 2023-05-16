import { useEffect, useState } from "react";
import { animated, easings, useSpring } from "react-spring";
import Entity from "./Entity";
import { randId, randNumber, isDev } from "../../utils";

export default function MoveableEntity(props) {

    const { entity } = props;

    const { 
        size=0, w=0, h=0, speed=1, y=0, startX=-70, endX=390, zIndex,
        intervalTime= () => randNumber(5_000, 10_000),
        onSpawnIntervalStart, onSpawnIntervalEnd,
        ...restProps 
    } = props;

    const [ moveAnimation, moveAnimationApi ] = useSpring(() => ({ from: { right: startX} }));
    const [ scaleAnimation, scaleAnimationApi ] = useSpring(() => ({ from: { scale: 1 } }));
    const [ entityImage, setEntityImage ] = useState(entity ? entity.iconAnimated : '');
    const [ onSpawnTimeout, setOnSpawnTimeout ] = useState(false);
    const [ moving, setMove ] = useState(false);
    const [ spawned, setSpawn ] = useState(false);
    const [ spawnCount, setSpawnCount ] = useState(0);

    useEffect(() => {
        if (!spawned) {
            moveAnimationApi.start({ from: { right: startX } });
            scaleAnimationApi.start({ scale: 1 });

            if (!onSpawnTimeout) startSpawnTimeout();
        } else {
            if (!moving && entity) {
                setMove(true);
                scaleAnimationApi.start({ scale: 1 });
                moveAnimationApi.start({
                    from: { right: startX },
                    to: { right: endX },
                    config: { duration: 5000 / speed },
                    onRest: () => { 
                        setSpawn(false);
                        setMove(false);
                    }
                });
            }
        }
    }, [spawned, entity, onSpawnTimeout, moving, spawnCount]);

    useEffect(() => {
        if (entity && !spawned) {
            setEntityImage(entity.iconAnimated);
        }
        if (!entity) {
            if (spawned) {
                scaleAnimationApi.start({
                    from: { scale: 1 },
                    to: [
                        { scale: 1.1, config: { duration: 100 } },
                        { scale: 0.9, config: { duration: 100 } }
                    ],
                    onRest: () => {
                        setSpawn(false);
                    }
                });
            }
        } else {
            if (spawned && entity.iconAnimated !== entityImage) {
                scaleAnimationApi.start({
                    from: { scale: 1 },
                    to: { scale: 1.3 },
                    config: { duration: 300, easing: easings.easeInCirc },
                    onRest: () => {
                        setEntityImage(entity ? entity.iconAnimated : '');
                    }
                });
            }
        }
    }, [entity, entityImage, spawned]);

    useEffect(() => {
        if (spawned) {
            scaleAnimationApi.start({
                from: { scale: 1.3 },
                to: { scale: 1 },
                config: { duration: 300, easing: easings.easeOutCirc }
            });
        }
        
    }, [entityImage, spawned]);

    function startSpawnTimeout() {
        setOnSpawnTimeout(true);
        if (onSpawnIntervalStart) onSpawnIntervalStart();

        return setTimeout(() => {
            setOnSpawnTimeout(false);
            if (onSpawnIntervalEnd) onSpawnIntervalEnd();
            setSpawn(true);
            setSpawnCount(v => v + 1);
        }, spawnCount == 0 ? randNumber(100, 8000) : getIntervalTime());
    }

    function getIntervalTime() {
        return typeof intervalTime === 'number' ? intervalTime : intervalTime();
    }

    const AnimatedFuncEntity = animated(Entity);
    return (
        <AnimatedFuncEntity 
            {...restProps} 
            className='moveable'
            style={{
                backgroundImage: `url(${entityImage})`,
                bottom: y,
                width: size || w,
                height: size || h,
                zIndex: zIndex || null,
                right: startX,
                ...moveAnimation,
                ...scaleAnimation,
            }}
        />
    );
}
