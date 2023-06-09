import { useEffect, useState } from "react"

export default function Snow({ weather }) {

    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(weather.isSnowing);
    }, [weather]);

    return (
        <div className={`sky-particle-container snow ${active ? 'show' : ''}`}>
            <div className="sky-particle snow"></div>
            <div className="sky-particle snow no-rotation"></div>
        </div>
    )
}