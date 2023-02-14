import { TEMP_TYPES } from '../../constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getDateWithTimezoneOffset } from '../../utils'
import Particles from './Particles'
import Car from '../Entities/Car'
import Bird from '../Entities/Bird'
import Bike from '../Entities/Bike'
import Person from '../Entities/Person'
import Rain from '../Rain/Rain'
import Snow from '../Snow/Snow'
import SunAndMoon from '../Entities/SunAndMoon'
import Background from '../Background/Background'

// Time between ticks in milliseconds
const tickInterval = 1000

export default function EntitiesManager({ weather, onEntityCollected }) {

    const [tick, setTick] = useState(Date.now())
    const particlesRef = useRef()

    const particlesMemo = useMemo(() => <Particles ref={particlesRef} />, [])

    useEffect(() => {

        setInterval(() => {
            setTick(Date.now())
        }, tickInterval)

    }, [])

    return (
        <div className="entities-container">
            <div className="entities-area">
                <SunAndMoon particles={particlesRef} weather={weather} onEntityCollected={onEntityCollected} />
                <Bird particles={particlesRef} weather={weather} tick={tick} onEntityCollected={onEntityCollected} />
                <Background weather={weather} />
                <Person particles={particlesRef} weather={weather} tick={tick} onEntityCollected={onEntityCollected} />
                <Bike particles={particlesRef} weather={weather} tick={tick} onEntityCollected={onEntityCollected} />
                <Car particles={particlesRef} weather={weather} tick={tick} onEntityCollected={onEntityCollected} />
                <Rain weather={weather}/>
                <Snow weather={weather}/>
                {particlesMemo}
            </div>
        </div>
    )
}

export function converDataToWeather(data) {
    if (!data || data.loading || data.cod !== 200) return null

    const temp = Math.floor(data.main.temp)
    
    let tempType = 0

    if (temp > 32) {
        tempType = TEMP_TYPES.verySunny
    } else if (temp > 25) {
        tempType = TEMP_TYPES.sunny
    } else if (temp < 0) {
        tempType = TEMP_TYPES.veryCold
    } else if (temp < 15) {
        tempType = TEMP_TYPES.cold
    } else {
        tempType = TEMP_TYPES.normal
    }

    const date = getDateWithTimezoneOffset((data.dt + data.timezone) * 1000)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const time = hours * 60 + minutes // time in minutes.

    // day.
    const dayStart = 4 * 60 // from 4:00
    const dayEnd = 18 * 60 // to 18:00

    const isDay = time >= dayStart && time < dayEnd

    // this is used to set the position of the moon or sun.
    // It's a number between 0 and 1.
    // If is sun, 0 the sun rises, 1 the sun sets, 0.5 is in the middle.
    // Same for the moon.
    let cycle = 0;

    if (isDay) {
        cycle = (time - dayStart) / (dayEnd - dayStart)
    } else {
        let t = 0;
        if (time < dayStart) {
            // 00:00 -> 4:00
            t = 360 + time
        } else {
            // 18:00 -> 23:59
            t = time - dayEnd;
        }
        
        cycle = (t - 0) / (600 - 0)
    }

    return {
        id: `${data.sys.id}${temp}`,
        temp: temp,
        tempType,
        time,
        isDay,
        cycle,
        isRaining: Boolean(data.rain),
        isSnowing: Boolean(data.snow)
    }
}