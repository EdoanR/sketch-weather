import { useContext, useState } from 'react';
import MoevableEntity from '../MoveableEntity';
import { EntitiesContext } from '../../../contexts/EntitiesContext';
import { randNumber } from '../../../utils';

export default function Bird({ weather }) {

    const { entities } = useContext( EntitiesContext );
    const [ entity, setEntity ] = useState(entities.bird);
    const [ posY, setPosY ] = useState( generatePosY() );
    const [ size, setSize ] = useState(25);

    function handleWeatherUpdate() {
        if (weather.isExtremeTemp) return setEntity(null);

        if (weather.isDay) {
            setEntity(entities.bird);
            setSize(25);
            return;
        }
        
        setEntity(entities.owl);
        setSize(30);
    }

    function handleIntervalStart() {
        setPosY( generatePosY() )
    }

    function generatePosY() {
        return randNumber(100, 169);
    }

    return (
        <MoevableEntity 
            weather={weather}
            entity={entity}
            onWeatherUpdate={handleWeatherUpdate}
            onSpawnIntervalStart={handleIntervalStart}
            speed={0.65}
            y={posY}
            size={size}
            startX={-70}
            endX={390}
            zIndex={7}
            intervalTime={() => {
                if (entity && entity.id === entities.bird.id) {
                    return randNumber(7_000, 15_000);
                } else {
                    return randNumber(10_000, 18_000);
                }
            }}
        />
    );
}