import { useState, useEffect, useContext } from "react";
import EntityContainer from "./EntityContainer";
import { EntitiesContext } from "../../contexts/EntitiesContext";
import { EntitiesListContext } from "../../contexts/EntitiesListContext";
import SmallButton from '../SmallButton';
import './index.scss';
import EntityBubble from "./EntityBubble";

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

        const updateArray = (radius) => {

            setEntities(v => {
                const newEntities = {...v};

                Object.keys(newEntities).forEach((k, i) => {

                    if (Math.abs(i - startIndex) === radius) {
                        newEntities[k].reveal = true;
                        if (i === startIndex) newEntities[k].pop = true;
                        if (newEntities[k].collected) newEntities[k].bright = true;
                    }
                    
                });
    
                return newEntities;
            });

            if (radius === Object.keys(entities).length - 1) {
                setTimeout(() => { setResetButtonVisibility(true); }, interval);
            }
        }
        
        for (let i = 0; i < Object.keys(entities).length; i++) {

            setTimeout(() => {
                updateArray(i);
            }, i * interval);
            
        }
    }

    if (!hasCollected) return null;

    return (
        <>
            <EntitiesListContext.Provider value={{ onBubbleEnd }}>
                <div className="bubbles">
                    {
                        Object.values(entities).map(entity => <EntityBubble entity={entity}/>)
                    }
                </div>
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