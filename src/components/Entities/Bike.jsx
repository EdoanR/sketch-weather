import { ENTITIES_IDS, TEMP_TYPES } from "../../constants";
import Entity from "./Entity";

export default class Bike extends Entity {
    constructor(props) {
        super(props)
        
        this.entityClass = ENTITIES_IDS.bike

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

    getSpriteClass({ tempType, temp }) {

        if (tempType >= TEMP_TYPES.sunny) {
            return 'bike-sunny';
        } else if (tempType <= TEMP_TYPES.cold) {
            return 'bike-cold';
        } else {
            return 'bike-normal';
        }
    }
}