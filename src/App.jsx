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
import { converDataToWeather } from './components/EntitiesManager';
import SmallButton from './components/SmallButton';
import { EntitiesContext } from './contexts/entitiesContext';

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
