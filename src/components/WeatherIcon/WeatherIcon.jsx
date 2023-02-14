import { useEffect, useState } from "react";
import './WeatherIcon.scss';
import icons from './icons';

const iconWidth = 64;

export default function WeatherIcon({ data }) {
    const [ selectedIconIndex, setSelecectedIconIndex ] = useState(-1);

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

        setSelecectedIconIndex(index);
    }

    function getIconUrl(icon) {
        return `/images/icons/animated/${icon}.gif`;
    }

    function handleOnClick(e) {
        const result = prompt(`Type the name of the icon, or the index of the icon.`);
        if (!result) return;

        if (/^\d+$/.test(result)) {
            const index = parseInt(result);
            if (index < 0 || index >= icons.length) return alert(`Index must be from 0 to ${icons.length - 1}.`);

            setSelecectedIconIndex(index);
        } else {
            setIcon(result.trim().toLowerCase())
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
                className="icons" 
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