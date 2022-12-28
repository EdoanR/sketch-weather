import { useEffect, useRef, useState } from 'react'
import EntitiesManager from '../EntitiesManager/EntitiesManager'
import TempCounter from './TempCounter'
import './WeatherCard.scss'

export default function WeatherCard({ data, previousData }) {

  const [location, setLocation] = useState('')
  const [temp, setTemp] = useState(0)
  const [previousTemp, setPreviousTemp] = useState(null)
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  const tempElementRef = useRef()

  useEffect(() => {
    if (!data) return
    console.log('effect', data)

    if (data.loading) {

      document.querySelectorAll('.info .loading-anim').forEach(el => {
        el.classList.add('close')
        el.classList.remove('open')
      })

    } else {
      setTimeout(() => {

        if (data.cod !== '404') {

          setTemp(Math.round(data.main.temp))
          setPreviousTemp(previousData && previousData.main ? Math.round(previousData.main.temp) : null)
          
          setLocation(`${data.name}, ${data.sys.country}`)
          setDescription(data.weather[0].description)

          const date = new Date(data.dt * 1000)
          const weekday = date.toLocaleString('en-US', { weekday: 'long' })
          const time = date.toLocaleString('en-US', { hourCycle: 'h24', hour: '2-digit', minute: '2-digit' })
          
          setDate(`${weekday}, ${time}`)

          tempElementRef.current.classList.add('open')
          tempElementRef.current.classList.remove('close')
          tempElementRef.current.classList.remove('mask-hide')


        } else {

          setLocation(`City not found :(`)
          setDescription('')
          setDate('')
          setPreviousTemp(null)

          tempElementRef.current.classList.add('close')
          tempElementRef.current.classList.remove('open')

        }

        document.querySelectorAll('.info .loading-anim').forEach(el => {
          el.classList.add('open')
          el.classList.remove('close')
        })

      }, 1000)
    }

  }, [data, temp, previousData])

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
            <div ref={tempElementRef} className={`temp-container row loading-anim mask-hide`}>
              <TempCounter className='temp' from={previousTemp == null ? temp : previousTemp} to={temp} />
              <div className='metric'>°C</div>
            </div>
          </div>
          <div className='column'>
            <div className='info location'>
              <span className='loading-anim close'>{location}</span>
            </div>
            <div className='info date'>
              <span className='loading-anim close'>{date}</span>
            </div>
            <div className='info desc'>
              <span className='loading-anim close'>{description}</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}