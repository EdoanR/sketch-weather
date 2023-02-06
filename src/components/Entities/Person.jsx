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

    getEntityToSpawn(weather) {
        if (this.isExtremeTemperature()) return null;
        
        if (weather.tempType <= TEMP_TYPES.cold) {
            if (weather.isRaining) return entities.personColdRainy;
            return entities.personCold;
        }

        if (weather.isRaining) return entities.personRainy;

        if (weather.isDay && weather.tempType >= TEMP_TYPES.sunny && Math.random() <= 0.5) {
            return entities.personSunny;
        }

        return entities.person;
    }
}