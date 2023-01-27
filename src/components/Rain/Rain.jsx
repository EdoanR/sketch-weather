import { useEffect } from "react"
import { useState } from 'react';

export default function Rain({ weather }) {

    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(weather.isRaining && !weather.isSnowing);
    }, [weather]);

    return (
        <div className={`sky-particle-container ${active ? 'show' : ''}`}>
            <div className="sky-particle rain"></div>
        </div>
    )
}