import { ENTITIES_IDS, TEMP_TYPES } from "../../constants";
import Entity from "./Entity";

export default class Car extends Entity {
    constructor(props) {
        super(props)
        
        this.entityClass = ENTITIES_IDS.car

        this.spawnChancesConfig = {
            minTime: 5000,
            chancePerTick: 1
        }
    }

    isInSpawnCondition(weather) {
        if (weather.temp <= -10) return false
        return true
    }

    getSpriteClass({ tempType, temp }) {

        if (tempType >= TEMP_TYPES.sunny) {
            return 'car-sunny';
        } else if (tempType <= TEMP_TYPES.cold) {
            return 'car-cold';
        } else {
            return 'car-normal';
        }
    }
}