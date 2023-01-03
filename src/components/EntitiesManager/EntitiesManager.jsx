import Person from '../Entities/Person'
import Car from '../Entities/Car'
import { TEMP_TYPES } from '../../constants'
import { useEffect, useState } from 'react'
import Particles from './Particles'

// Time between ticks in milliseconds
const tickInterval = 1000

export default function EntitiesManager({ weather }) {

    const [tick, setTick] = useState()

    useEffect(() => {

        setInterval(() => {
            setTick(Date.now())
        }, tickInterval)

    }, [])

    return (
        <div className="entities-container">
            <div className="background"></div>
            <div className="objects-area">
                <Person weather={weather} tick={tick} />
                <Car weather={weather} tick={tick} />

                <Particles />
            </div>
        </div>
    )
}

export function converDataToWeather(data) {
    if (!data || data.loading || data.cod !== 200) return null

    const { temp } = data.main
    
    let tempType = 0

    if (temp > 30) {
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

    return {
        id: `${data.sys.id}${temp}`,
        temp: temp,
        tempType,
        isDay: true,
        isRaining: false
    }
}