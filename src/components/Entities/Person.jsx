import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
import entities from "../EntitiesList/entities";
import Entity from "./Entity";

/**
 * Don't show up in extreme heat/cold.
 * Warm clothing on cold, sun hat on sunny days (except at night).
 * When raining none of them show up, only a person with umbrella.
 */

export default class Person extends Entity {
    constructor(props) {
        super(props)

        this.baseClassName = ENTITIES_CLASS_TYPES.person

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 10000,
            chancePerTick: 0.15
        }

        this.maxTimeOnScreen = 15000
        this.debugKey = '1'
    }

    shouldSpawn({ tempType }) {
        if (tempType <= TEMP_TYPES.veryCold || tempType >= TEMP_TYPES.verySunny) return false
        return true
    }

    handleWeatherUpdate(weather) {

        if (weather.isRaining) {
            this.setState({
                entity: entities.personRainy
            })
        }

        super.handleWeatherUpdate(weather);
    }

    spawn() {
        if (!this.props.isRaining) {
            if (this.shouldSpawnAsSunnyPerson()) {

                this.setState({
                    entity: entities.personSunny
                })
    
            } else {
                this.setState({
                    entity: entities.person
                })
            }
        }
        
        super.spawn()
    }

    shouldSpawnAsSunnyPerson() {
        const weather = this.props.weather
        if (!weather.isDay) return false
        if (weather.isRaining) return false
        if (weather.tempType < TEMP_TYPES.sunny) return false
        if (Math.random() > 0.5) return false // 30% chance
        return true
    }
}