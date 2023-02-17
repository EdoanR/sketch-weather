import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import entities from "../EntitiesList/entities";
import './EntitiesProgression.scss';

export default forwardRef((props, ref) => {

    const [ list, setList ] = useState(entities)

    useImperativeHandle(ref, () => ({
        onEntityCollected(entity) {
            const newList = {...list}
            newList[entity.keyName].collected = true

            setList(newList)
        }
    }));

    function loadList() {

    }

    function saveList() {

    }

    useEffect(() => {
        loadList()
    }, [])

    return (
        <div className="entities-progression">
            {
                Object.keys(list).map(k => {
                    const entity = list[k]
                    return (
                        <div 
                            key={entity.id} 
                            title={entity.name}
                            className='entity-item border-anim-hover'
                        >
                            <div className={'item-icon item-' + entity.keyName + (entity.collected ? ' collected' : '')} />
                        </div>
                    )
                })
            }
        </div>
    )
})