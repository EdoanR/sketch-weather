import React, { useRef, useState } from 'react';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import './animations.scss'
import './entities.scss'
import './effects.scss'
import './App.scss'
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './components/WeatherCard/WeatherCard';
import EntitiesProgression from './components/EntitiesProgression/EntitiesProgresson';
import WeatherEditOptions from './components/WeatherEditOptions/WeatherEditOptions';
import { converDataToWeather } from './components/EntitiesManager/EntitiesManager';

export default function App() {

  const [ weather, setWeather ] = useState()
  const [ data, setData ] = useState()
  const [ previousData, setPreviousData ] = useState()
  // const [ history, setHistory ] = useState([])

  const inputRef = useRef()
  const progressionRef = useRef()

  function searchWeather(search) {
    if (!search) return

    setData({ loading: true })

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`).then(async res => {
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

    searchWeather(inputRef.current.value)
  }

  function handleCollectedEntity(entity) {
    progressionRef.current.onEntityCollected(entity)
  }

  return (
    <div className='App'>
      <SearchBar onSubmit={handleOnSearch} inputRef={inputRef} />
      <WeatherCard weather={weather} data={data} previousData={previousData} onEntityCollected={handleCollectedEntity} />
      <EntitiesProgression ref={progressionRef}/>
      <WeatherEditOptions weather={weather} onChange={ (newWeather) => { setWeather(newWeather) } } />
    </div>
  )
};
