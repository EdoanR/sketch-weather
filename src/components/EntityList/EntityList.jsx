import { useState } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import EntityContainer from "./EntityContainer";
import './EntityList.scss';

export default forwardRef(({ onListChange, entities }, ref) => {

    const [ hasCollected, setHasCollected ] = useState(false);

    useImperativeHandle(ref, () => ({
        onEntityCollected: (entity) => {
            const newList = {...entities}
            newList[entity.keyName].collected = true

            setHasCollected(true);

            onListChange(newList);
        }
    }));

    function loadList() {

    }

    // function saveList() {

    // }

    useEffect(() => {
        loadList()
    }, [])

    if (!hasCollected) return null;

    return (
        <div className="entity-list">
            {
                Object.keys(entities).map(k => {
                    const entity = entities[k]
                    return (
                        <EntityContainer key={entity.id} entity={entity} />
                    )
                })
            }
        </div>
    )
})