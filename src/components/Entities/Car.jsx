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

        this.maxTimeOnScreen = 10000
        this.debugKey = '2'
    }

    getEntityToSpawn(weather) {
        if (this.isExtremeTemperature()) return null;

        if (weather.isDay && !weather.isRaining && weather.tempType >= TEMP_TYPES.sunny && Math.random() <= 0.3) {
            return entities.iceCreamTruck;
        }

        return entities.car;
    }
}