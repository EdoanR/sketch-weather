import { TEMP_TYPES } from '../../constants'
import { useContext, useEffect, useState } from 'react'
import { getDateWithTimezoneOffset } from '../../utils'
import Car from '../Entities/Car'
import Bird from '../Entities/Bird'
import Bike from '../Entities/Bike'
import Person from '../Entities/Person'
import Rain from '../Rain'
import Snow from '../Snow'
import SunAndMoon from '../Entities/SunAndMoon'
import Background from '../Background'
import { EntitiesContext } from '../../contexts/entitiesContext'

// Time between ticks in milliseconds
const tickInterval = 1000

export default function EntitiesManager({ weather }) {

    const [tick, setTick] = useState(Date.now())
    const { entities, collectEntity } = useContext(EntitiesContext);

    useEffect(() => {

        setInterval(() => {
            setTick(Date.now())
        }, tickInterval)

    }, [])

    return (
        <div className="entities-container">
            <div className="entities-area">
                <SunAndMoon weather={weather} {...{collectEntity, entities}} />
                <Bird weather={weather} tick={tick} {...{collectEntity, entities}} />
                <Background weather={weather} />
                <Person weather={weather} tick={tick} {...{collectEntity, entities}} />
                <Bike weather={weather} tick={tick} {...{collectEntity, entities}} />
                <Car weather={weather} tick={tick} {...{collectEntity, entities}} />
                <Rain weather={weather}/>
                <Snow weather={weather}/>
            </div>
        </div>
    )
}