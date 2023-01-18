import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
import entities from "../EntitiesList/entities";
import Entity from "./Entity";

/**
 * Normal cars show up at any time or temp (except extreme heat/cold).
 * Sometimes ice cream truck show up at sunny days, except when raining and night.
 */

export default class Car extends Entity {
    constructor(props) {
        super(props)
        
        this.baseClassName = ENTITIES_CLASS_TYPES.car

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 15000,
            chancePerTick: 0.1
        }

        this.state = {
            entity: entities.car
        }

        this.maxTimeOnScreen = 10000
        this.debugKey = '2'
        this.normalCarInARow = 0
    }

    shouldSpawn({ tempType }) {
        if (tempType <= TEMP_TYPES.veryCold || tempType >= TEMP_TYPES.verySunny) return false
        return true
    }

    spawn() {
        if (this.shouldSpawnAsIceCreamTruck()) {
            // Ice cream truck
            this.setState({
                entity: entities.iceCreamTruck
            })

            this.normalCarInARow = 0
        } else {
            this.setState({
                entity: entities.car
            })
            this.normalCarInARow++
        }

        super.spawn()
    }

    shouldSpawnAsIceCreamTruck() {
        if (this.normalCarInARow === 0) return false // Prevent spawning two ice creams in a row

        const weather = this.props.weather
        if (!weather.isDay) return false
        if (weather.isRaining) return false
        if (weather.tempType < TEMP_TYPES.sunny) return false
        if (Math.random() > 0.3 && this.normalCarInARow < 5) return false // 30% chance
        return true
    }
}