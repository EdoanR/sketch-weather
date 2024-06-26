import React, { useEffect, useRef, useState } from 'react';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './animations.scss';
import './effects.scss';
import './App.scss';
import SearchBar from './components/Inputs/SearchBar';
import WeatherCard from './components/WeatherCard';
import EntitiesList from './components/EntityList';
import defaultEntitiesList from './components/EntityList/entities';
import PreviousWeathers from './components/PreviousWeathers';
import FontButton from './components/Inputs/FontButton';
import ModalButton from './components/Inputs/ModalButton';
import APIModal from './components/Modals/APIModal';
import ResetCollectionModal from './components/Modals/ResetCollectionModal';
import ReactModal from 'react-modal';
import { Tooltip } from 'react-tooltip';
import SmallButton from './components/Inputs/SmallButton';
import { EntitiesContext } from './contexts/EntitiesContext';
import { TEMP_TYPES } from './constants';
import { getDateWithTimezoneOffset, isDev } from './utils';

ReactModal.setAppElement('#root');

export default function App() {
	const [weather, setWeather] = useState();
	const [data, setData] = useState();
	const [previousData, setPreviousData] = useState();
	const [entities, setEntities] = useState(defaultEntitiesList);
	const [lastCollectedEntity, setLastCollectedEntity] = useState(null);
	const [lastUncollectedEntity, setLastUncollectedEntity] = useState(null);
	const [apiModalIsOpen, setApiModalIsOpen] = useState(false);
	const [resetCollectionModalIsOpen, setResetCollectionModalIsOpen] = useState(false);
	const [apiKey, setApiKey] = useState(
		localStorage.getItem('api-key') || import.meta.env.VITE_OPEN_WEATHER_API_KEY || '4c6efa111e140f53a1b967afc4231d4e'
	);
	const [celsiusUnit, setCelsiusUnit] = useState(localStorage.getItem('celsius-unit') !== 'false');
	const [searchedUsingPath, setSearchUsingPath] = useState(false);

	const searchBarInputRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			setApiModalIsOpen(!apiKey);
		}, 1000);

		const lastPathIndex = location.pathname.lastIndexOf('/');
		const loc = decodeURI(location.pathname.substring(lastPathIndex + 1));
		if (loc && !searchedUsingPath) {
			searchBarInputRef.current.value = loc;
			searchData(loc);
			setSearchUsingPath(true);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('celsius-unit', celsiusUnit);
	}, [celsiusUnit]);

	function searchData(search) {
		if (!search) return;

		if (!apiKey) {
			setApiModalIsOpen(true);
			return;
		}

		setData({ loading: true });

		fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${apiKey}`)
			.then(async (res) => {
				const data = await res.json();

				console.log('data:', data);

				setPreviousData(data);
				setData(data);
				const weather = converDataToWeather(data);
				if (weather) {
					if (isDev()) console.log('weather:', weather);
					setWeather(weather);
				}
			})
			.catch((err) => {
				console.log('Error getting data:\n', err);
				alert(`Could not get data, please check your internet connection.`);
			});
	}

	function handleOnSearch(e) {
		e.preventDefault();

		searchData(searchBarInputRef.current.value);
	}

	function collectEntity(entity, bubbleAnim = false, bright = false) {
		const newEntities = { ...entities };
		newEntities[entity.keyName].collected = true;
		if (bubbleAnim) newEntities[entity.keyName].bubbleAnim = true;
		if (bright) newEntities[entity.keyName].bright = true;

		setEntities(newEntities);
		setLastCollectedEntity(entity);
	}

	function uncollectEntity(entity) {
		const newEntities = { ...entities };
		newEntities[entity.keyName].collected = false;
		newEntities[entity.keyName].bubbleAnim = false;
		newEntities[entity.keyName].bright = false;

		setEntities(newEntities);
		setLastUncollectedEntity(entity);
	}

	function updateEntity(newEntity) {
		const newEntities = { ...entities };
		newEntities[newEntity.keyName] = newEntity;
		setEntities(newEntities);
	}

	const entitiesContextValues = {
		entities,
		lastCollectedEntity,
		lastUncollectedEntity,
		collectEntity,
		updateEntity,
		uncollectEntity,
		setEntities,
	};

	return (
		<div className="App">
			<Tooltip id="tooltip" />
			<main>
				<APIModal
					isOpen={apiModalIsOpen}
					setIsOpen={setApiModalIsOpen}
					apiKey={apiKey}
					setApiKey={setApiKey}
					onAfterAPISubmit={() => {
						if (searchBarInputRef.current.value) searchData(searchBarInputRef.current.value);
					}}
				/>
				<SearchBar onSubmit={handleOnSearch} searchBarInputRef={searchBarInputRef} />
				<EntitiesContext.Provider value={entitiesContextValues}>
					<WeatherCard weather={weather} data={data} previousData={previousData} celsiusUnit={celsiusUnit} />
					<PreviousWeathers data={data} searchData={searchData} celsiusUnit={celsiusUnit} />
					<EntitiesList resetModalIsOpen={setResetCollectionModalIsOpen} />
					<ResetCollectionModal isOpen={resetCollectionModalIsOpen} setIsOpen={setResetCollectionModalIsOpen} />
				</EntitiesContext.Provider>
				<div className="top-left-buttons">
					<FontButton className="animated" tabIndex="1" />
					<ModalButton className="animated" tabIndex="2" onClick={() => setApiModalIsOpen((v) => !v)} />
					<SmallButton
						className="animated"
						tabIndex="3"
						onClick={() => setCelsiusUnit((v) => !v)}
						tooltip={celsiusUnit ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
					>
						<div style={{ fontSize: 'large', fontFamily: '"Open Sans", sans-serif' }} className="content">
							{celsiusUnit ? '°C' : '°F'}
						</div>
					</SmallButton>
				</div>
			</main>
			<footer>
				<div>
					<span>Made by </span>
					<div className="signature" alt="Edoan">
						<span>Edoan</span>
					</div>
				</div>
				<div className="icons">
					<FooterIcon iconName="twitter" alt="Twitter" url="https://twitter.com/EuEdoan" />
					<FooterIcon iconName="github" alt="GitHub" url="https://github.com/EdoanR/sketch-weather" />
					<FooterIcon iconName="ko-fi" alt="Ko-fi" url="https://ko-fi.com/edoan" />
				</div>
			</footer>
		</div>
	);
}

function FooterIcon({ iconName, url, ...restProps }) {
	const [hovering, setHover] = useState(false);

	return (
		<a href={url} target="_blank">
			<img
				onMouseEnter={() => {
					setHover(true);
				}}
				onMouseLeave={() => {
					setHover(false);
				}}
				data-tooltip-id={restProps.alt ? 'tooltip' : null}
				data-tooltip-content={restProps.alt || null}
				src={
					hovering
						? `/sketch-weather/images/icons/animated/${iconName}.gif`
						: `/sketch-weather/images/icons/static/${iconName}.png`
				}
				style={{
					width: 40,
					height: 40,
				}}
				{...restProps}
			/>
		</a>
	);
}

function converDataToWeather(data) {
	if (!data || data.loading || data.cod !== 200) return null;

	const temp = Math.floor(data.main.temp);

	let tempType = 0;

	if (temp > 32) {
		tempType = TEMP_TYPES.verySunny;
	} else if (temp >= 25) {
		tempType = TEMP_TYPES.sunny;
	} else if (temp < 0) {
		tempType = TEMP_TYPES.veryCold;
	} else if (temp < 15) {
		tempType = TEMP_TYPES.cold;
	} else {
		tempType = TEMP_TYPES.normal;
	}

	const date = getDateWithTimezoneOffset((Date.now() + data.timezone) * 1000);
	const hours = date.getHours();
	const minutes = date.getMinutes();

	const time = hours * 60 + minutes; // time in minutes.

	// day.
	const dayStart = 4 * 60; // from 4:00
	const dayEnd = 18 * 60; // to 18:00

	const isDay = time >= dayStart && time < dayEnd;

	// this is used to set the position of the moon or sun.
	// It's a number between 0 and 1.
	// If is sun, 0 the sun rises, 1 the sun sets, 0.5 is in the middle.
	// Same for the moon.
	let cycle = 0;

	if (isDay) {
		cycle = (time - dayStart) / (dayEnd - dayStart);
	} else {
		let t = 0;
		if (time < dayStart) {
			// 00:00 -> 4:00
			t = 360 + time;
		} else {
			// 18:00 -> 23:59
			t = time - dayEnd;
		}

		cycle = (t - 0) / (600 - 0);
	}

	return {
		id: data.id,
		temp: temp,
		tempType,
		time,
		isDay,
		cycle,
		isRaining: Boolean(data.rain),
		isSnowing: Boolean(data.snow),
		isExtremeTemp: tempType <= TEMP_TYPES.veryCold || tempType >= TEMP_TYPES.verySunny,
	};
}
