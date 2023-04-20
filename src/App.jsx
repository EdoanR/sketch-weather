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
import { converDataToWeather } from './components/EntitiesManager';
import ModalButton from './components/ModalButton';
import APIModal from './components/APIModal';
import ReactModal from 'react-modal';
import { Tooltip } from 'react-tooltip';

ReactModal.setAppElement('#root');

export default function App() {

	const [weather, setWeather] = useState()
	const [data, setData] = useState()
	const [previousData, setPreviousData] = useState()
	const [entities, setEntities] = useState(defaultEntitiesList)
    const [modalIsOpen, setModalIsOpen] = useState();
	const [apiKey, setApiKey] = useState(localStorage.getItem('api-key') || import.meta.env.VITE_OPEN_WEATHER_API_KEY || '');

	const inputRef = useRef()
	const entityListRef = useRef()

	useEffect(() => {
		setTimeout(() => {
			setModalIsOpen(!apiKey)
		}, 1000);
	}, [])

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

		searchData(inputRef.current.value)
	}

	function handleCollectedEntity(entity) {
		entityListRef.current.onEntityCollected(entity)
	}

	function handleEntityListChange(newList) {
		setEntities(newList)
	}

	return (
		<div className='App'>
        	<Tooltip id='tooltip'/>
			<APIModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} apiKey={apiKey} setApiKey={setApiKey} onAfterAPISubmit={() => { if (inputRef.current.value) searchData(inputRef.current.value); }}/>
			<SearchBar onSubmit={handleOnSearch} inputRef={inputRef} />
			<WeatherCard weather={weather} data={data} entities={entities} previousData={previousData} onEntityCollected={handleCollectedEntity} />
			<PreviousWeathers data={data} searchData={searchData} />
			<EntitiesList ref={entityListRef} entities={entities} onListChange={handleEntityListChange} />
			<div className='top-left-buttons'>
				<FontButton />
				<ModalButton onClick={() => setModalIsOpen(true)}/>
			</div>
		</div>
	)
};
