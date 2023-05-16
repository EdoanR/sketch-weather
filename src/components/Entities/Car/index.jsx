import { useContext, useState } from 'react';
import MoevableEntity from '../MoveableEntity';
import { EntitiesContext } from '../../../contexts/EntitiesContext';
import { TEMP_TYPES } from '../../../constants';

export default function Car({ weather }) {

    const { entities } = useContext( EntitiesContext );
    const [ entity, setEntity ] = useState(null);
    const [ height, setHeight ] = useState(75);
    const [ speed, setSpeed ] = useState(1);
    const [ sameEntityCount, setSameEntityCount ] = useState(0);

    function handleWeatherUpdate() {
        if (entity && entity.id === entities.iceCreamTruck.id && !couldSpawnIceCreamTruck()) {
            setEntity(null);
        } else {
            updateEntity();
        }
    }

    function updateEntity() {
        if (weather.isExtremeTemp) return setEntity(null);

        if (couldSpawnIceCreamTruck()) {
            
            if (sameEntityCount >= 2) {
                entity && entity.id === entities.car.id ? setIceCreamTruck() : setCar();
                setSameEntityCount(1);
                return;
            }

            const newEntity = Math.random() <= 0.5 ? entities.iceCreamTruck : entities.car;
            if (entity && newEntity.id === entity.id) setSameEntityCount(v => v + 1);
            newEntity.id === entities.car.id ? setCar() : setIceCreamTruck();

        } else {
            setCar();
        }

    }

    function setIceCreamTruck() {
        setSpeed(0.85);
        setHeight(96);
        setEntity(entities.iceCreamTruck);
    }

    function setCar() {
        setSpeed(1);
        setHeight(75);
        setEntity(entities.car);
    }

    function couldSpawnIceCreamTruck() {
        return weather.isDay && !weather.isRaining && !weather.isSnowing && weather.tempType >= TEMP_TYPES.sunny;
    }

    return (
        <MoevableEntity 
            weather={weather}
            entity={entity}
            onWeatherUpdate={handleWeatherUpdate}
            onSpawnIntervalStart={updateEntity}
            speed={speed}
            startX={-154}
            y={0}
            w={133}
            h={height}
            zIndex={9}
        />
    );
}