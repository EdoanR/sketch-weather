import { useState, forwardRef, useEffect, useImperativeHandle } from "react";
import EntityContainer from "./EntityContainer";
import './index.scss';

let revealed = false;

export default forwardRef(({ onListChange, entities }, ref) => {

    const [ hasCollected, setHasCollected ] = useState(false);
    const [ collectedEntityId, setCollectedEntityId ] = useState('');
    const [ entitiesReveal, setEntitiesReveal ] = useState([]);

    useImperativeHandle(ref, () => ({
        onEntityCollected: (entity) => {
            const newList = {...entities}
            newList[entity.keyName].collected = true

            setHasCollected(true);

            onListChange(newList);

            setCollectedEntityId(entity.id);
        }
    }));

    function loadList() {

    }

    // function saveList() {

    // }

    useEffect(() => {
        loadList();
    }, [entities])

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
})