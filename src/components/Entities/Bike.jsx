import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
import entities from "../EntitiesList/entities";
import Entity from "./Entity";

/**
 * Bike does not show up in rain or extreme heat/cold.
 */

export default class Bike extends Entity {
    constructor(props) {
        super(props)
        
        this.entityClass = ENTITIES_CLASS_TYPES.bike

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 20000,
            chancePerTick: 0.075
        }

        this.maxTimeOnScreen = 12000
    }

    isInSpawnCondition(weather) {
        if (weather.temp <= -10) return false
        return true
    }

    getEntity({ tempType }) {
        if (tempType >= TEMP_TYPES.sunny) return entities.bikeSunny
        if (tempType <= TEMP_TYPES.cold) return entities.bikeCold
        return entities.bike
    }
}