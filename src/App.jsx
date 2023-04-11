import React, { useRef, useState } from 'react';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import './animations.scss'
import './entities.scss'
import './effects.scss'
import './App.scss'
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './components/WeatherCard/WeatherCard';
import EntitiesList from './components/EntityList/EntityList';
// import WeatherEditOptions from './components/WeatherEditOptions/WeatherEditOptions';
import defaultEntitiesList from './components/EntityList/entities';
import PreviousWeathers from './components/PreviousWeathers/PreviousWeathers';
import FontButton from './components/FontButton/FontButton';
import SoundControl from './components/SoundControl/SoundControl';
import { converDataToWeather } from './components/EntitiesManager/EntitiesManager';

export default function App() {

  // TODO: fix searching for continent showing as undefined country.

  const [ weather, setWeather ] = useState()
  const [ data, setData ] = useState()
  const [ previousData, setPreviousData ] = useState()
  const [ entities, setEntities ] = useState(defaultEntitiesList)
  const [ soundCtrl, setSoundCtrl ] = useState({ volume: 1, muted: false });

  const inputRef = useRef()
  const entityListRef = useRef()

  function searchData(search) {
    if (!search) return

    setData({ loading: true })

    const key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${key}`).then(async res => {
      const data = await res.json()

      if (!data || data.cod !== 200) {
        console.log('Could not get data:\n', data) // TODO: show on website a response about that.
      } else {
        console.log('data:', data)
      }

      setPreviousData(data)
      setData(data)
      const weather = converDataToWeather(data)
      if (weather) {
        console.log('weather:', weather)
        setWeather(weather)
      }

    }).catch(err => {
      console.log('Error getting data:\n', err) // TODO: show on website a response about that.
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
      <SearchBar onSubmit={handleOnSearch} inputRef={inputRef} />
      <div className="test mask unshow" onClick={e => { 
        /** @type {HTMLElement} */
        const element = e.target;
        const show = element.classList.contains('show');
        if (show) {
          element.classList.remove('show');
          element.classList.add('unshow');
        } else {
          element.classList.remove('unshow');
          element.classList.add('show');
        }

        element.classList.add('hold-play');
        element.classList.remove('play');
        setTimeout(() => {
          element.classList.add('play');
        }, 60);

      }}></div>
      <WeatherCard weather={weather} data={data} entities={entities} previousData={previousData} onEntityCollected={handleCollectedEntity} />
      <PreviousWeathers data={data} searchData={searchData} />
      <EntitiesList ref={entityListRef} entities={entities} onListChange={handleEntityListChange}/>
      <div className='top-left-buttons'>
        <FontButton />
        <SoundControl soundCtrl={soundCtrl} setSoundCtrl={setSoundCtrl}/>
        {/* <WeatherEditOptions weather={weather} onChange={ (newWeather) => { setWeather(newWeather) } } /> */}
      </div>
    </div>
  )
};
