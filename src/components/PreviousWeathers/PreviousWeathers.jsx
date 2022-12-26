import './PreviousWeathers.scss'

function PreviousWeatherItem({ data, onHistoryClick }) {
    return (
        <div className='weather-mini-card column border-anim-hover' onClick={ (e) => { onHistoryClick(data) } }>
            <div className='column'>
                <div className='top row'>
                    <img className='icon' src="https://ssl.gstatic.com/onebox/weather/64/cloudy.png" alt="" />
                    <div className='temp-container row'>
                    <div className='temp'>{Math.round(data.main.temp)}</div>
                    <div className='metric'>°C</div>
                    </div>
                </div>
                <div className='bottom column'>
                    <div className='location'>{data.name}, {data.sys.country}</div>
                </div>
            </div>
        </div>
    )
}

export default function PreviousWeathers({ history, onHistoryClick }) {
    return (
        <div className="weather-history row">
            {
                history.map(data => {
                    return <PreviousWeatherItem key={data.sys.id} data={data} onHistoryClick={onHistoryClick}/>
                })
            }
        </div>
    )
}