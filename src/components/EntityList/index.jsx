import { useState, useEffect, useContext } from "react";
import EntityContainer from "./EntityContainer";
import { EntitiesContext } from "../../contexts/EntitiesContext";
import { EntitiesListContext } from "../../contexts/EntitiesListContext";
import SmallButton from '../SmallButton';
import './index.scss';

export default function EntitiesList() {

    const [ hasCollected, setHasCollected ] = useState(false);
    const [ hasLoaded, setLoaded ] = useState(false);
    const [ revealed, setReveal ] = useState(false);
    const [ isResetButtonVisible, setResetButtonVisibility ] = useState(false);
    const { entities, updateEntity, collectEntity, setEntities } = useContext(EntitiesContext);

    useEffect(() => {
        if (hasLoaded) return;

        loadFromLocalStorage();
    }, [hasLoaded]);

    useEffect(() => {
        if (Object.values(entities).some(en => en.collected)) {
            setHasCollected(true);
        }

        if (hasLoaded) saveToLocalStorage();
    }, [entities, hasLoaded]);

    function loadFromLocalStorage() {
        setLoaded(true);

        const collectedIdsItem = localStorage.getItem('collected-entities');
        if (!collectedIdsItem) return;

        const collectedIds = JSON.parse(collectedIdsItem);
        if (!collectedIds.length) return;

        const entitiesById = {};
        Object.values(entities).forEach(entity => entitiesById[entity.id] = entity);

        collectedIds.forEach(entityId => {
            const entity = entitiesById[entityId];

            collectEntity(entity, false, true);
        });

        playRevealAnimation(0);
    }

    function saveToLocalStorage() {
        const collectedIds = Object.values(entities).filter(entity => entity.collected).map(entity => entity.id);
        localStorage.setItem('collected-entities', JSON.stringify(collectedIds));
    }

    function resetCollectedEntities() {
        setEntities(v => {
            const newEntities = {...v};
            Object.keys(newEntities).forEach(k => {
                newEntities[k].collected = false;
                newEntities[k].pop = false;
                newEntities[k].bubbleAnim = false;
                newEntities[k].bright = false;
            });

            return newEntities;
        });

        localStorage.removeItem('collected-entities');
    }

    function onBubbleEnd(entity) {
        const index = Object.values(entities).findIndex(en => en.id === entity.id);

        if (!revealed) {
            playRevealAnimation(index);
        } else {
            setEntities(v => {
                const newEntities = {...v};
                newEntities[entity.keyName].reveal = true;
                newEntities[entity.keyName].bright = true;
                newEntities[entity.keyName].pop = true;
    
                return newEntities;
            });
        }
        
    }

    function playRevealAnimation(startIndex) {
        setReveal(true);

        const interval = 100;

        const updateArray = (i) => {
            const entitiesArr = Object.values(entities);
            const entity = entitiesArr[i];
            entity.reveal = true;
            if (i === startIndex) entity.pop = true;
            if (entity.collected) entity.bright = true;
            updateEntity(entity);

            if (i === entitiesArr.length - 1) {
                setTimeout(() => { setResetButtonVisibility(true); }, interval);
            }
        }
        
        for (let i = 0; i < Object.keys(entities).length; i++) {

            setTimeout(() => {
                updateArray(i);
            }, i * interval);
            
        }

        // const arr = Object.values(entities);
        // const duration = arr.length;
        // const interval = 100;
        // const index = startIndex;

        // const updateArray = function (arr, index, step) {
        //     const radius = step;

        //     const entitiesArray = Object.values(entities);

        //     for (let i = 0; i < arr.length; i++) {
        //         if (Math.abs(i - index) <= radius) {
        //             const newEntity = {...entitiesArray[i], reveal: true, pop: i === startIndex};
        //             updateEntity(newEntity);   
        //         }
        //     }
        // }

        // // Define a loop to update and display the array at each step of the animation
        // for (let i = 0; i <= duration; i++) {

        //     setTimeout(() => {
        //         updateArray(arr, index, i);

        //         if (i === duration - 1) setResetButtonVisibility(true);
        //     }, i * interval);
        // }
    }

    if (!hasCollected) return null;

    return (
        <>
            <EntitiesListContext.Provider value={{ onBubbleEnd }}>
                <div className="entity-list">
                    {
                        Object.values(entities).map((entity, i) => {
                            return (
                                <EntityContainer 
                                    key={entity.id} 
                                    entity={entity} 
                                />
                            )
                        })
                    }
                </div>
            </EntitiesListContext.Provider>
            <SmallButton 
                className={'reset-button' + (isResetButtonVisible ? ' pop-anim' : ' hide')} 
                content="Reset" 
                onClick={() => { resetCollectedEntities() }
            }/>
        </>
    )
}