import { useEffect, useRef, useState } from 'react'
import { getDateWithTimezoneOffset } from '../../utils'
import EntitiesManager from '../EntitiesManager/EntitiesManager'
import TempCounter from './TempCounter'
import WeatherIcon from '../WeatherIcon/WeatherIcon'
import './WeatherCard.scss'

let dataLoadTimeout = null

export default function WeatherCard({ data, weather, previousData, onEntityCollected, entities }) {

  const [location, setLocation] = useState('')
  const [temp, setTemp] = useState(0)
  const [previousTemp, setPreviousTemp] = useState(0)
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [show, setShow] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [locationEraseEffectPlay, setLocationEraseEffectPlay] = useState(true)

  const tempElementRef = useRef()

  useEffect(() => {
    if (!data) return

    if (data.loading) {

      setShowLocation(false);
      setLocationEraseEffectPlay(false);
      setTimeout(() => {
        setLocationEraseEffectPlay(true);
      }, 60)
      clearTimeout(dataLoadTimeout);

    } else {

      dataLoadTimeout = setTimeout(() => {

        if (data.cod !== '404') {

          setTemp(Math.floor(data.main.temp))
          setPreviousTemp(previousData && previousData.main ? Math.floor(previousData.main.temp) : Math.floor(data.main.temp))

          setLocation(`${data.name}${data.sys.country ? ', ' + data.sys.country : ''}`)
          setDescription(data.weather[0].description)

          const date = getDateWithTimezoneOffset((data.dt + data.timezone) * 1000)

          const weekday = date.toLocaleString('en-US', { weekday: 'long' })
          const time = date.toLocaleString('en-US', { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' })

          setDate(`${weekday}, ${time}`)


        } else {

          setLocation(`City not found :(`)
          setDescription('')
          setDate('')

        }

        setShow(true);
        setShowLocation(true);
        setLocationEraseEffectPlay(false);
        setTimeout(() => {
          setLocationEraseEffectPlay(true);
        }, 60)

      }, 1000)
    }

  }, [data, previousData])

  if (!data) return null

  return (
    <div className={'weather-card border-anim erase-effect-fast' + (show ? ' show play' : ' hidden')}>

      <div className='left-area'>
        <div className='top-left row'>
          <WeatherIcon data={data} onEntityCollected={onEntityCollected} entities={entities} />
          <div ref={tempElementRef} className={`temp-container row`}>
            <TempCounter className='temp' from={previousTemp} to={temp} />
            <div className='metric'>°C</div>
          </div>
        </div>
        <div className='column'>
          <div className={'info location erase-effect hold-play' + (showLocation ? ' show' : ' hidden') + ( locationEraseEffectPlay ? ' play' : '')}>
            <span>{location}</span>
          </div>
          <div className={'info date erase-effect hold-play' + (showLocation ? ' show' : ' hidden') + ( locationEraseEffectPlay ? ' play' : '')}>
            <span>{date}</span>
          </div>
          <div className={'info desc erase-effect hold-play' + (showLocation ? ' show' : ' hidden') + ( locationEraseEffectPlay ? ' play' : '')}>
            <span>{description}</span>
          </div>
        </div>
      </div>
      <div className='right-area'>
        { weather && <EntitiesManager weather={weather} onEntityCollected={onEntityCollected} entities={entities} /> }
      </div>

    </div>
  )
}