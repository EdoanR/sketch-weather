import Person from '../Entities/Person'
import Car from '../Entities/Car'

export default function EntitiesManager({ data }) {
    return (
        <div className="entities-container">
            <div className="background"></div>
            <div className="objects-area">
                <Person data={data} />
                <Car data={data} />
            </div>
        </div>
    )
}