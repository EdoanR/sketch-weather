import { useEffect, useState } from "react";
import './index.scss';
import icons from './icons';

const iconWidth = 64;
let isFirstIcon = true;

export default function WeatherIcon({ data, onEntityCollected, entities }) {
    const [ selectedIconIndex, setSelecectedIconIndex ] = useState(-1);

    useEffect(() => {
        if (!data || data.loading) return;

        if (selectedIconIndex !== -1) isFirstIcon = false;

        if (data.cod !== 200) {
            setIcon('not_found');
        } else {
            setIcon(data.weather[0].icon);
        }
    }, [data, selectedIconIndex]);

    function setIcon(icon) {
        const index = icons.findIndex(ic => ic === icon);
        if (index === -1) return console.log(`Could not find icon named "${icon}"`);

        setSelecectedIconIndex(index);
    }

    function getIconUrl(icon) {
        return `/images/icons/animated/weathers/${icon}.gif`;
    }

    function handleOnClick(e) {
        const currentIcon = icons[selectedIconIndex];
        const clickedIcon = e.target.id;
        if (!currentIcon) return;
        if (clickedIcon !== currentIcon) return;

        const entity = getEntityFromIcon(currentIcon);
        if (entity) onEntityCollected(entity);
    }

    function getEntityFromIcon(icon) {
        if (icon === '13d') return entities.snowDay;
        return null
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
                style={{ 
                    left: (selectedIconIndex * -iconWidth) + 'px',
                    transitionDuration: isFirstIcon ? '0s' : '' 
                }}
            >
                {
                    icons.map(icon => {
                        let className = 'icon'
                        const entity = getEntityFromIcon(icon)

                        if (entity) className += ' entity-' + entity.keyName + ' ' + (entity.collected ? 'collected' : 'collectable');

                        return <div 
                            className={className}
                            id={icon}
                            key={icon} 
                            onClick={(e) => handleOnClick(e)}
                            style={{ 
                                width: iconWidth + 'px',
                                height: iconWidth + 'px',
                                backgroundImage: `url(${getIconUrl(icon)})`
                            }} 
                        />
                    })
                }
            </div>
        </div>
    )
}