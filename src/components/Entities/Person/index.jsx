import { useContext, useState } from 'react';
import MoevableEntity from '../MoveableEntity';
import { EntitiesContext } from '../../../contexts/EntitiesContext';
import { TEMP_TYPES } from '../../../constants';

export default function Person({ weather }) {

    const { entities } = useContext( EntitiesContext );
    const [ entity, setEntity ] = useState(entities.person);
    const [ width, setWidth ] = useState(42);
    const [ height, setHeight ] = useState(56);

    const setPerson = () => setEntityWithWidthAndHeight(42, 56, entities.person);
    const setSunnyPerson = () => setEntityWithWidthAndHeight(42, 56, entities.personSunny);
    const setColdPerson = () => setEntityWithWidthAndHeight(42, 56, entities.personCold);
    const setRainyPerson = () => setEntityWithWidthAndHeight(50, 71, entities.personRainy);
    const setRainyColdPerson = () => setEntityWithWidthAndHeight(51, 69, entities.personColdRainy);

    function handleWeatherUpdate(weather) {
        if (weather.isExtremeTemp) return setEntity(null);

        if (weather.tempType <= TEMP_TYPES.cold) {
            if (weather.isRaining) return setRainyColdPerson();
            return setColdPerson();
        } else if (weather.isRaining) {
            return setRainyPerson();
        }

        if (weather.tempType >= TEMP_TYPES.sunny) {
            if (entity && ( entity.id === entities.person.id || entity.id === entities.personSunny.id )) return;
            Math.random() <= 0.5 ? setSunnyPerson() : setPerson();
        } else {
            setPerson();
        }
    }

    function handleSpawnIntervalStart() {
        if (!entity) return;
        if (entity.id !== entities.person.id && entity.id !== entities.personSunny.id) return;
        if (weather.tempType >= TEMP_TYPES.sunny) {
            entity.id === entities.person.id ? setSunnyPerson() : setPerson();
        } else {
            setPerson();
        }
    }

    function setEntityWithWidthAndHeight(w, h, entity) {
        setWidth(w);
        setHeight(h);
        setEntity(entity);
    }

    return (
        <MoevableEntity 
            weather={weather}
            entity={entity}
            onWeatherUpdate={handleWeatherUpdate}
            onSpawnIntervalStart={handleSpawnIntervalStart}
            speed={0.5}
            y={38}
            w={width}
            h={height}
            zIndex={7}
        />
    );
}