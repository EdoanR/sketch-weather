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
        
        this.entityClass = ENTITIES_CLASS_TYPES.person

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 15000,
            chancePerTick: 0.09
        }

        this.maxTimeOnScreen = 20000
    }

    isInSpawnCondition({ tempType }) {
        if (tempType <+ TEMP_TYPES.veryCold) return false
        return true
    }

    getEntity({ tempType, isRaining, isDay }) {
        if (isRaining) return entities.personRainy
        if (isDay && tempType >= TEMP_TYPES.sunny) return entities.personSunny
        if (tempType <= TEMP_TYPES.cold) return entities.personCold
        return entities.person
    }
}