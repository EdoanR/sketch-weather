import { useContext, useState } from "react";
import Entity from "../Entity";
import { EntitiesContext } from "../../../contexts/EntitiesContext";
import { lerp } from "../../../utils";
import "./index.scss";

export default function SunAndMoon({ weather }) {
	const { entities } = useContext(EntitiesContext);
    const [ posY, setPosY ] = useState(0);
    const [ entity, setEntity ] = useState(entities.sun);

    function handleWeatherUpdate(weather) {
        setEntity( weather.isDay ? entities.sun : entities.moon )
        setPosY( createPosY(weather) );
    }

    function createPosY(weather) {
        const value = weather.cycle
        const max = 50
        const min = 192

        return lerp(min, max, value)
    }

    return (
        <Entity 
            weather={weather} 
            entity={entity} 
            onWeatherUpdate={handleWeatherUpdate} 
            className='sun-moon'
            style={{
                backgroundImage: `url(${entity.iconAnimated})`,
                bottom: posY
            }}
        />
    )
}