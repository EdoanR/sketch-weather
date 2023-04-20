import { useEffect, useState } from 'react'
import { getDateWithTimezoneOffset } from '../../utils'
import EntitiesManager from '../EntitiesManager'
import TempCounter from './TempCounter'
import WeatherIcon from '../WeatherIcon'
import './index.scss'

let dataLoadTimeout = null

let tempEraseEffectTimeout = null;
let locationEraseEffectTimeout = null;

export default function WeatherCard({ data, weather, previousData, onEntityCollected, entities }) {

	const [location, setLocation] = useState('')
	const [temp, setTemp] = useState(0)
	const [previousTemp, setPreviousTemp] = useState(0)
	const [date, setDate] = useState('')
	const [description, setDescription] = useState('')
	const [show, setShow] = useState(false)
	const [showLocation, setShowLocation] = useState(false)
	const [locationEraseEffectPlay, setLocationEraseEffectPlay] = useState(true)
	const [showTemp, setShowTemp] = useState(false)
	const [tempEraseEffectPlay, setTempEraseEffectPlay] = useState(true)

	useEffect(() => {
		if (!data) return;

		if (data.loading) {

			setShowLocation(false);

		} else {

			clearTimeout(dataLoadTimeout);
			dataLoadTimeout = setTimeout(() => {

				if (data.cod == 200) {

					setTemp(Math.floor(data.main.temp))
					setPreviousTemp(previousData && previousData.main ? Math.floor(previousData.main.temp) : Math.floor(data.main.temp))

					setLocation(`${data.name}${data.sys.country ? ', ' + data.sys.country : ''}`)
					setDescription(data.weather[0].description)

					const date = getDateWithTimezoneOffset((data.dt + data.timezone) * 1000)

					const weekday = date.toLocaleString('en-US', { weekday: 'long' })
					const time = date.toLocaleString('en-US', { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' })

					setDate(`${weekday}, ${time}`)

					setShowTemp(true);
				} else {

					if (data.cod == 404) {
						setLocation(`Location not found...`)
					} else if (data.cod == 401) {
						setLocation((data.message || 'Invalid API key.').replace(/(?<=(?:^|\s))(https?:\/\/\S+)/g, `<a href="$1">$1</a>`))
					} else {
						setLocation((data.message || 'Some error occured. Sorry :(').replace(/(?<=(?:^|\s))(https?:\/\/\S+)/g, `<a href="$1">$1</a>`))
					}
					setDescription('')
					setDate('')

					setShowTemp(false);
				}

				setShow(true);
				setShowLocation(true);

			}, 1000)
		}

	}, [data, previousData]);

	useEffect(() => {

		setTempEraseEffectPlay(false);
		clearTimeout(tempEraseEffectTimeout);
		tempEraseEffectTimeout = setTimeout(() => {
			setTempEraseEffectPlay(true);
		}, 60);

	}, [showTemp])

	useEffect(() => {

		setLocationEraseEffectPlay(false);
		clearTimeout(locationEraseEffectTimeout)
		locationEraseEffectTimeout = setTimeout(() => {
			setLocationEraseEffectPlay(true);
		}, 60);

	}, [showLocation])

	if (!data) return null

	return (
		<div className={'weather-card border-anim erase-effect-fast' + (show ? ' show play' : ' hidden')}>

			<div className='left-area'>
				<div className='top-left row'>
					<WeatherIcon data={data} onEntityCollected={onEntityCollected} entities={entities} />
					<div className={`temp-container row erase-effect hold-play` + (showTemp ? ' show' : ' hidden') + (tempEraseEffectPlay ? ' play' : '')}>
						<TempCounter className='temp' from={0} to={temp} />
						<div className='metric'>°C</div>
					</div>
				</div>
				<div className='column'>
					<div className={'info location erase-effect hold-play' + (showLocation ? ' show' : ' hidden') + (locationEraseEffectPlay ? ' play' : '')}>
						<span dangerouslySetInnerHTML={{ __html: location }}></span>
					</div>
					<div className={'info date erase-effect hold-play' + (showLocation ? ' show' : ' hidden') + (locationEraseEffectPlay ? ' play' : '')}>
						<span>{date}</span>
					</div>
					<div className={'info desc erase-effect hold-play' + (showLocation ? ' show' : ' hidden') + (locationEraseEffectPlay ? ' play' : '')}>
						<span>{description}</span>
					</div>
				</div>
			</div>
			<div className='right-area'>
				{weather && <EntitiesManager weather={weather} onEntityCollected={onEntityCollected} entities={entities} />}
			</div>

		</div>
	)
}