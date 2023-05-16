import { useContext, useState } from 'react';
import MoevableEntity from '../MoveableEntity';
import { EntitiesContext } from '../../../contexts/EntitiesContext';
import { TEMP_TYPES } from '../../../constants';

export default function Bike({ weather }) {

    const { entities } = useContext( EntitiesContext );
    const [ entity, setEntity ] = useState(null);
    const [ sameEntityCount, setSameEntityCount ] = useState(0);

    function updateEntity() {
        if (weather.isExtremeTemp || weather.isRaining || weather.isSnowing) return setEntity(null);
        if (weather.tempType <= TEMP_TYPES.cold) return setEntity(entities.bikeCold);

        if (sameEntityCount >= 2) {
            setEntity( entity && entity.id === entities.bike.id ? entities.bikeGirl : entities.bike );
            setSameEntityCount(1);
        } else {
            const newEntity = Math.random() <= 0.5 ? entities.bikeGirl : entities.bike;
            if (entity && newEntity.id === entity.id) setSameEntityCount(v => v + 1);

            setEntity(newEntity); 
        }
    }

    return (
        <MoevableEntity 
            weather={weather}
            entity={entity}
            onWeatherUpdate={updateEntity}
            onSpawnIntervalStart={updateEntity}
            speed={0.85}
            y={22}
            size={66}
            startX={-70}
            endX={390}
            zIndex={7}
        />
    );
}