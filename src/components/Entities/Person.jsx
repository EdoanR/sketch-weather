import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
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

        this.sameEntityCount = 0
        this.lastEntityId = '';
        this.debugKey = '1'
    }

    getEntityToSpawn(weather) {
        if (this.isExtremeTemperature()) return null;
        
        if (weather.tempType <= TEMP_TYPES.cold) {
            if (weather.isRaining) return this.props.entities.personColdRainy;
            return this.props.entities.personCold;
        }

        if (weather.isRaining) return this.props.entities.personRainy;

        if (this.shouldSpawnSunnyPerson(weather)) {
            this.lastEntityId = this.props.entities.personSunny.id;
            return this.props.entities.personSunny;
        }

        this.lastEntityId = this.props.entities.person.id;
        return this.props.entities.person;
    }

    shouldSpawnSunnyPerson(weather) {
        if (!weather.isDay) return false; 
        if (!(weather.tempType >= TEMP_TYPES.sunny)) return false; 
        if (this.lastEntityId === this.props.entities.personSunny.id) return false;
        return true;
    }
}