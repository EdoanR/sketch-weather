import { useState, useEffect, useContext } from "react";
import EntityContainer from "./EntityContainer";
import { EntitiesContext } from "../../contexts/entitiesContext";
import SmallButton from '../SmallButton';
import './index.scss';

let revealed = false;

export default function EntitiesList() {

    const [ hasCollected, setHasCollected ] = useState(false);
    const [ hasLoaded, setLoaded ] = useState(false);
    const [ entitiesReveal, setEntitiesReveal ] = useState([]);
    const [ reveled, setReveal ] = useState(false);
    const [ isResetButtonVisible, setResetButtonVisibility ] = useState(false);
    const { entities, lastCollectedEntity, lastUncollectedEntity, collectEntity, uncollectEntity } = useContext(EntitiesContext);

    useEffect(() => {
        if (!lastCollectedEntity) return;

        handleEntityCollected(lastCollectedEntity);
    }, [lastCollectedEntity]);

    useEffect(() => {
        if (hasLoaded) return;

        loadFromLocalStorage();
    }, [hasLoaded]);

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

            collectEntity(entity);
        });

        playRevealAnimation(0);
    }

    function saveToLocalStorage() {
        const collectedIds = Object.values(entities).filter(entity => entity.collected).map(entity => entity.id);
        localStorage.setItem('collected-entities', JSON.stringify(collectedIds));
    }

    function resetCollectedEntities() {
        Object.values(entities).forEach(entity => {
            if (!entity.collected) return;

            uncollectEntity(entity);
        });

        localStorage.removeItem('collected-entities');
    }

    function handleEntityCollected(entity) {
        setHasCollected(true);
        saveToLocalStorage();
    }

    function playRevealAnimation(startIndex) {
        if (reveled) return;
        setReveal(true);

        const arr = Array(Object.keys(entities).length).fill(false);
        const duration = arr.length;
        const interval = 100;
        const index = startIndex;

        const updateArray = function (arr, index, step) {
            const radius = step;

            for (let i = 0; i < arr.length; i++) {
                if (Math.abs(i - index) <= radius) {
                    arr[i] = true;
                } else {
                    arr[i] = false;
                }
            }

            setEntitiesReveal([...arr]);
        }

        // Define a loop to update and display the array at each step of the animation
        for (let i = 0; i <= duration; i++) {

            setTimeout(() => {
                updateArray(arr, index, i);

                if (i === duration - 1) setResetButtonVisibility(true);
            }, i * interval);
        }
    }

    function onPopAnimation(entity) {
        if (revealed) return;
        revealed = true;

        const index = Object.values(entities).findIndex(en => en.id === entity.id);

        playRevealAnimation(index);
    }

    if (!hasCollected) return null;

    return (
        <>
            <div className="entity-list">
                {
                    Object.values(entities).map((entity, i) => {
                        return (
                            <EntityContainer 
                                key={entity.id} 
                                entity={entity} 
                                entitiesReveal={entitiesReveal} 
                                index={i} 
                                onPopAnimation={onPopAnimation}
                            />
                        )
                    })
                }
            </div>
            <SmallButton 
                className={'reset-button' + (isResetButtonVisible ? ' pop-anim' : ' hide')} 
                content="Reset" 
                onClick={() => { resetCollectedEntities() }
            }/>
        </>
    )
}