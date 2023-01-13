import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
import entities from "../EntitiesList/entities";
import Entity from "./Entity";

/**
 * Normal cars show up at any time or temp.
 * Sometimes ice cream truck show up at sunny days, except when raining.
 * None of them show up in extreme heat/cold
 */

export default class Car extends Entity {
    constructor(props) {
        super(props)
        
        this.entityClass = ENTITIES_CLASS_TYPES.car

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 15000,
            chancePerTick: 0.1
        }

        this.maxTimeOnScreen = 10000
    }

    isInSpawnCondition(weather) {
        if (weather.temp <= -10) return false
        return true
    }

    getEntity({ tempType }) {
        if (tempType >= TEMP_TYPES.sunny) return entities.iceCreamTruck
        return entities.car
    }
}