import { useContext, useEffect, useState } from 'react'
import Car from '../Entities/Car'
import Bird from '../Entities/Bird'
import Bike from '../Entities/Bike'
import Person from '../Entities/Person'
import Rain from '../Rain'
import Snow from '../Snow'
import Background from '../Background'
import SunAndMoon from '../Entities/SunAndMoon'
import { EntitiesContext } from '../../contexts/EntitiesContext'

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
                <SunAndMoon weather={weather} />
                <Bird weather={weather}/>
                <Background weather={weather} />
                <Person weather={weather} />
                <Bike weather={weather}/>
                <Car weather={weather} />
                <Rain weather={weather}/>
                <Snow weather={weather}/>
            </div>
        </div>
    )
}