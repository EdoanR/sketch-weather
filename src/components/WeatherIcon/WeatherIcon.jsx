import { useEffect, useState } from "react";
import './WeatherIcon.scss';
import icons from './icons';

const iconWidth = 64;

export default function WeatherIcon({ data, onEntityCollected, entities }) {
    const [ selectedIconIndex, setSelecectedIconIndex ] = useState(-1);
    const [ collectable, setCollectable ] = useState(false);
    const [ collected, setCollected ] = useState(false);

    useEffect(() => {
        if (!data || data.loading) return;

        if (data.cod !== 200) {
            setIcon('city_not_found');
        } else {
            setIcon(data.weather[0].icon);
        }
    }, [data]);

    function setIcon(icon) {
        const index = icons.findIndex(ic => ic === icon);
        if (index === -1) return console.log(`Could not find icon named "${icon}"`);

        if (icons[index] === '13n') {
            if (entities.snowNight.collected) {
                setCollectable(false)
                setCollected(true)
            } else {
                setCollected(false)
                setCollectable(true)
            }
        } else {
            setCollectable(false)
            setCollected(false)
        }

        setSelecectedIconIndex(index);
    }

    function getIconUrl(icon) {
        return `/images/icons/animated/${icon}.gif`;
    }

    function handleOnClick(e) {
        const currentIcon = icons[selectedIconIndex];
        if (!currentIcon) return;

        if (currentIcon === '13n') {
            onEntityCollected(entities.snowNight);
            setCollectable(false)
            setCollected(true)
        }
    }

    return (
        <div 
            className="weather-icon-container"
            style={{
                width: iconWidth + 'px',
                height: iconWidth,
            }}
        >
            <div 
                className={"icons" + (collected ? ' collected' : '') + (collectable ? ' collectable' : '')} 
                style={{ left: (selectedIconIndex * -iconWidth) + 'px' }}
                onClick={(e) => handleOnClick(e)}
            >
                {
                    icons.map(icon => (
                        <div 
                            className='icon' 
                            id={icon}
                            key={icon} 
                            style={{ 
                                width: iconWidth + 'px',
                                height: iconWidth + 'px',
                                backgroundImage: `url(${getIconUrl(icon)})`
                            }} 
                        />
                    ))
                }
            </div>
        </div>
    )
}