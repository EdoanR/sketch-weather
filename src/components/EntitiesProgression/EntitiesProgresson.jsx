import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import entities from "../EntitiesList/entities";

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

    return <div>{Object.keys(list).map(k => {
        const entity = list[k]
        return <div key={entity.id} style={entity.collected ? {color: 'green'} : null}>{entity.name}</div>
    })}</div>
})