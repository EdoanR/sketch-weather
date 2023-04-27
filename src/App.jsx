import React, { useEffect, useRef, useState } from 'react';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import './animations.scss'
import './entities.scss'
import './effects.scss'
import './App.scss'
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import EntitiesList from './components/EntityList';
import defaultEntitiesList from './components/EntityList/entities';
import PreviousWeathers from './components/PreviousWeathers';
import FontButton from './components/FontButton';
import ModalButton from './components/ModalButton';
import APIModal from './components/APIModal';
import ReactModal from 'react-modal';
import { Tooltip } from 'react-tooltip';
import SmallButton from './components/SmallButton';
import { EntitiesContext } from './contexts/entitiesContext';
import { TEMP_TYPES } from './constants';
import { getDateWithTimezoneOffset } from './utils';

ReactModal.setAppElement('#root');

export default function App() {

	const [weather, setWeather] = useState()
	const [data, setData] = useState()
	const [previousData, setPreviousData] = useState()
	const [entities, setEntities] = useState(defaultEntitiesList)
	const [lastCollectedEntity, setLastCollectedEntity] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState();
	const [apiKey, setApiKey] = useState(localStorage.getItem('api-key') || import.meta.env.VITE_OPEN_WEATHER_API_KEY || '');
	const [celsiusUnit, setCelsiusUnit] = useState( localStorage.getItem('celsius-unit') === 'true' );
	const [searchedUsingPath, setSearchUsingPath] = useState(false);

	const searchBarInputRef = useRef()

	useEffect(() => {
		setTimeout(() => {
			setModalIsOpen(!apiKey)
		}, 1000);

		const loc = decodeURI(location.pathname.replace('/', ''));
		if (loc && !searchedUsingPath) {
			searchBarInputRef.current.value = loc;
			searchData(loc);
			setSearchUsingPath(true);
		}

	}, [])

	useEffect(() => {
		localStorage.setItem('celsius-unit', celsiusUnit);
	}, [celsiusUnit]);

	function searchData(search) {
		if (!search) return

		if (!apiKey) {
			setModalIsOpen(true);
			return;
		}

		setData({ loading: true })

		fetch(`http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${apiKey}`).then(async res => {
			const data = await res.json();

			console.log('data:', data)

			setPreviousData(data)
			setData(data)
			const weather = converDataToWeather(data)
			if (weather) {
				console.log('weather:', weather)
				setWeather(weather)
			}

		}).catch(err => {
			console.log('Error getting data:\n', err);
			alert(`Could not get data, please check your internet connection.`);
		})
	}

	function handleOnSearch(e) {
		e.preventDefault()

		searchData(searchBarInputRef.current.value)
	}

	function collectEntity(entity) {
		const newEntities = {...entities};
		newEntities[entity.keyName].collected = true

		setEntities(newEntities);
		setLastCollectedEntity(entity);
	}

	return (
		<div className='App'>
        	<Tooltip id='tooltip'/>
			<APIModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} apiKey={apiKey} setApiKey={setApiKey} onAfterAPISubmit={() => { if (searchBarInputRef.current.value) searchData(searchBarInputRef.current.value); }}/>
			<SearchBar onSubmit={handleOnSearch} searchBarInputRef={searchBarInputRef} />
			<EntitiesContext.Provider value={{entities, lastCollectedEntity, collectEntity}}>
				<WeatherCard weather={weather} data={data} previousData={previousData} celsiusUnit={celsiusUnit} />
				<PreviousWeathers data={data} searchData={searchData} celsiusUnit={celsiusUnit} />
				<EntitiesList />
			</EntitiesContext.Provider>
			<div className='top-left-buttons'>
				<FontButton tabIndex="1"/>
				<ModalButton tabIndex="2" onClick={() => setModalIsOpen(true)}/>
				<SmallButton tabIndex="3" onClick={() => setCelsiusUnit(v => !v)} tooltip={celsiusUnit ? 'Switch to Fahrenheit' : 'Switch to Celsius'}>
					<div style={{fontSize: 'large', fontFamily: '"Open Sans", sans-serif'}} className='content'>
						{celsiusUnit ? '°C' : '°F'}
					</div>
				</SmallButton>
			</div>
		</div>
	)
};

function converDataToWeather(data) {
    if (!data || data.loading || data.cod !== 200) return null

    const temp = Math.floor(data.main.temp)
    
    let tempType = 0

    if (temp > 32) {
        tempType = TEMP_TYPES.verySunny
    } else if (temp > 25) {
        tempType = TEMP_TYPES.sunny
    } else if (temp < 0) {
        tempType = TEMP_TYPES.veryCold
    } else if (temp < 15) {
        tempType = TEMP_TYPES.cold
    } else {
        tempType = TEMP_TYPES.normal
    }

    const date = getDateWithTimezoneOffset((data.dt + data.timezone) * 1000)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const time = hours * 60 + minutes // time in minutes.

    // day.
    const dayStart = 4 * 60 // from 4:00
    const dayEnd = 18 * 60 // to 18:00

    const isDay = time >= dayStart && time < dayEnd

    // this is used to set the position of the moon or sun.
    // It's a number between 0 and 1.
    // If is sun, 0 the sun rises, 1 the sun sets, 0.5 is in the middle.
    // Same for the moon.
    let cycle = 0;

    if (isDay) {
        cycle = (time - dayStart) / (dayEnd - dayStart)
    } else {
        let t = 0;
        if (time < dayStart) {
            // 00:00 -> 4:00
            t = 360 + time
        } else {
            // 18:00 -> 23:59
            t = time - dayEnd;
        }
        
        cycle = (t - 0) / (600 - 0)
    }

    return {
        id: data.id,
        temp: temp,
        tempType,
        time,
        isDay,
        cycle,
        isRaining: Boolean(data.rain),
        isSnowing: Boolean(data.snow)
    }
}
