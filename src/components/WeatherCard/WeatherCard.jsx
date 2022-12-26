import { useEffect, useState } from 'react'
import EntitiesManager from '../EntitiesManager/EntitiesManager'
import TempCounter from './TempCounter'
import './WeatherCard.scss'

export default function WeatherCard({ data }) {

  const [location, setLocation] = useState('')
  const [temp, setTemp] = useState(0)
  const [previousTemp, setPreviousTemp] = useState(0)
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!data) return
    console.log('effect', data)

    if (data.loading) {
      document.querySelectorAll('.loading-scrap').forEach(el => el.classList.remove('show'))
    } else {
      setTimeout(() => {

        if (data.cod !== '404') {
          setPreviousTemp(temp)
          setTemp(Math.round(data.main.temp))
          setLocation(`${data.name}, ${data.sys.country}`)
          setDescription(data.weather[0].description)

          const date = new Date(data.dt * 1000)
          const weekday = date.toLocaleString('en-US', { weekday: 'long' })
          const time = date.toLocaleString('en-US', { hourCycle: 'h24', hour: '2-digit', minute: '2-digit' })
          
          setDate(`${weekday}, ${time}`)
        } else {
          setLocation(`City not found :(`)
          setDescription('')
          setDate('')
        }
        document.querySelectorAll('.loading-scrap').forEach(el => el.classList.add('show'))

      }, 500)
    }

  }, [data, temp])

  if (!data) return null

  // const date = new Date(data.dt * 1000)
  // const weekday = date.toLocaleString('en-US', { weekday: 'long' })
  // const time = date.toLocaleString('en-US', { hourCycle: 'h24', hour: '2-digit', minute: '2-digit' })

  return (
    <div className='weather-card border-anim'>

      <EntitiesManager data={data} />

      <div className='overlay column'>
        <div className='column'>
          <div className='top-left row'>
            <img className='icon' src="https://ssl.gstatic.com/onebox/weather/64/cloudy.png" alt="" />
            <div className='temp-container row'>
              <TempCounter className='temp' from={previousTemp} to={temp} />
              <div className='metric'>°C</div>
            </div>
          </div>
          <div className='column'>
            <div className='location'>
              <div className='loading-scrap'></div>
              <span>{location}</span>
            </div>
            <div className='date'>
              <div className='loading-scrap small'></div>
              <span>{date}</span>
            </div>
            <div className='desc'>
              <div className='loading-scrap small'></div>
              <span>{description}</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}