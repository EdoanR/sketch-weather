import { useRef, useState } from 'react';
import { isDev } from '../../utils';
import './WeatherEditOptions.scss'

export default function WeatherEditOptions({ weather, onChange }) {

    const [isOpen, setIsOpen] = useState(localStorage.getItem('weather-edit-toggle') === 'true');
    const rainCheckbox = useRef();
    const snowCheckbox = useRef();
    const dayCheckbox = useRef();
    const tempTypeInput = useRef();

    function handleToggleClick(e) {
        setIsOpen(!isOpen)
        localStorage.setItem('weather-edit-toggle', !isOpen);
    }

    function handleOptionChange(e) {
        if (!weather) return;

        const newWeather = {...weather};
        newWeather.isRaining = rainCheckbox.current.checked;
        newWeather.isSnowing = snowCheckbox.current.checked;
        newWeather.isDay = dayCheckbox.current.checked;
        newWeather.tempType = tempTypeInput.current.value;

        console.log(newWeather);

        onChange(newWeather);
    }

    if ( !isDev() ) return null

    return (
        <div className='weather-edit-container border-anim '>
            <button className='weather-edit-toggle' onClick={handleToggleClick}>WE</button>
            {isOpen && weather && (
                <div className='weather-edit-options'>
                    <label>
                        <span>temp type: </span>
                        <input type="number" ref={tempTypeInput} value={weather.tempType} min={1} max={5} onChange={handleOptionChange}/>
                    </label>
                    <label>
                        <input type="checkbox" ref={rainCheckbox} checked={weather.isRaining} onChange={handleOptionChange}/>
                        <span>rain</span>
                    </label>
                    <label>
                        <input type="checkbox" ref={snowCheckbox} checked={weather.isSnowing} onChange={handleOptionChange}/>
                        <span>snow</span>
                    </label>
                    <label>
                        <input type="checkbox" ref={dayCheckbox} checked={weather.isDay} onChange={handleOptionChange}/>
                        <span>day</span>
                    </label>
                    
                </div>
            )}
        </div>
    );
}