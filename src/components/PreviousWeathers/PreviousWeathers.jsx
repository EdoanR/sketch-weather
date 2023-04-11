import { useEffect, useState } from "react";
import './PreviousWeathers.scss';

function PreviousWeathers({ data, max, searchData }) {

    const [ prevDatasList, setPrevDatasList ] = useState([]);
    const [ prevData, setPrevData ] = useState(data);

    useEffect(() => {
        if (!data) return;
        if (data.loading) return;
        if (data.cod !== 200) return;

        if (prevData && data.id !== prevData.id) {

            let newPrevDatas = [];

            const searchDataIndex = prevDatasList.findIndex(d => d.id === prevData.id);
            if (searchDataIndex !== -1) {
                // Same place was already added to it, so let's just update it.

                newPrevDatas = [...prevDatasList];
                newPrevDatas[searchDataIndex] = prevData;
            } else {
                newPrevDatas = [prevData, ...prevDatasList];
                if (newPrevDatas.length > max) newPrevDatas.pop()
            }
            
            setPrevDatasList(newPrevDatas);
        }

        setPrevData(data);
    }, [data, max, prevData, prevDatasList]);

    if (prevDatasList.length === 0) return null;

    function handleAnimationEnd(e) {
        e.target.classList.remove('pop-anim');
    }

    return (
        <div className="previous-weathers">
            {
                prevDatasList.map(d => {
                    const location = d.name + (d.sys.country ? ', ' + d.sys.country : '');
                    const iconUrl = `/images/icons/static/weathers/${d.weather[0].icon}.png`;

                    return (
                        <div 
                            key={d.id} 
                            className='border-anim-hover pop-anim'
                            onClick={() => ( searchData(location) )}
                            onAnimationEnd={ handleAnimationEnd }
                            >
                                <div className="info">
                                    <div className="icon" style={{ backgroundImage: `url(${iconUrl})` }}/>
                                    <div className="temp">{Math.floor(d.main.temp)} °C</div>
                                </div>
                                <div className="location">{location}</div>
                        </div>
                    );
                })
            }
        </div>
    )
}

PreviousWeathers.defaultProps = {
    data: null,
    max: 3
}

export default PreviousWeathers;