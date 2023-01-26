import './Rain.scss'
import { useEffect } from "react"
import { useState } from 'react';

export default function Rain({ weather }) {

    const [active, setActive] = useState(false);

    useEffect(() => {
        console.log('[rain] weather changed', weather);

        setActive(weather.isRaining);
    }, [weather]);

    return (
        <div className={`rain-container ${active ? 'show' : ''}`}>
            <div className="rain"></div>
        </div>
    )
}