import { randNumber } from '../../utils'
import { useState } from "react";

export default function Particles() {
    const [ particles, setParticles ] = useState([])

    return <>
        {particles.map(p => {
            return <div className='particle' key={randNumber(1000000, 9999999)}></div>
        })}
    </>
}