import React, { useRef, useState } from 'react';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import './animations.scss'
import './entities.scss'
import './App.scss'
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './components/WeatherCard/WeatherCard';
// import PreviousWeathers from './components/PreviousWeathers/PreviousWeathers';

export default function App() {

  const [ weather, setWeather ] = useState()
  // const [ history, setHistory ] = useState([])

  const inputRef = useRef()

  // function addToHistory(data) {

  //   let newHistory = [...history]

  //   let index = history.findIndex(d => d.sys.id === data.sys.id)
  //   if (index !== -1) {
  //     // if already exist, move to the front.
  //     newHistory.splice(index, 1)
  //     newHistory = [data, ...newHistory]
  //     return setHistory(newHistory)
  //   }

  //   if (newHistory.length === 3) newHistory.pop() // max of three items in history

  //   setHistory([data, ...newHistory])
  // }

  function searchWeather(search) {
    if (!search) return

    setWeather({ loading: true })

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`).then(async res => {
      const data = await res.json()

      if (!data || data.cod !== 200) {
        console.log('Could not get data:\n', data) // TODO: show on website a response about that.
      } else {
        console.log('data:', data)
      }

      setWeather(data)

    }).catch(err => {
      console.log('Error getting data:\n', err) // TODO: show on website a response about that.
    })
  }

  function handleOnSearch(e) {
    e.preventDefault()

    searchWeather(inputRef.current.value)
  }

  return (
    <div className='App'>
      
      <SearchBar onSubmit={handleOnSearch} inputRef={inputRef} />

      <WeatherCard data={weather} />

    </div>
  )
};
