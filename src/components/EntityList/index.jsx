import { useState, useEffect, useContext } from "react";
import EntityContainer from "./EntityContainer";
import { EntitiesContext } from "../../contexts/entitiesContext";
import './index.scss';

let revealed = false;

export default function EntitiesList() {

    const [ hasCollected, setHasCollected ] = useState(false);
    const [ collectedEntityId, setCollectedEntityId ] = useState('');
    const [ entitiesReveal, setEntitiesReveal ] = useState([]);
    const { entities, lastCollectedEntity } = useContext(EntitiesContext);

    useEffect(() => {
        if (!lastCollectedEntity) return;

        handleEntityCollected(lastCollectedEntity);
    }, [lastCollectedEntity]);

    function handleEntityCollected(entity) {
        setHasCollected(true);
        setCollectedEntityId(entity.id);
    }

    function playRevealAnimation(startIndex) {
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
        <div className="entity-list">
            {
                Object.values(entities).map((entity, i) => {
                    return (
                        <EntityContainer 
                            key={entity.id} 
                            entity={entity} 
                            collectedEntityId={collectedEntityId} 
                            entitiesReveal={entitiesReveal} 
                            index={i} 
                            onPopAnimation={onPopAnimation}
                        />
                    )
                })
            }
        </div>
    )
}