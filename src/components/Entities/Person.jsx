import { ENTITIES_IDS, TEMP_TYPES } from "../../constants";
import Entity from "./Entity";

export default class Person extends Entity {
    constructor(props) {
        super(props)
        
        this.entityClass = ENTITIES_IDS.person

        this.spawnChancesConfig = {
            minTime: 5000,
            chancePerTick: 1
        }

        this.maxTimeOnScreen = 20000
    }

    isInSpawnCondition(weather) {
        if (weather.temp <= -10) return false
        return true
    }

    getSpriteClass({ tempType, temp }) {

        if (tempType >= TEMP_TYPES.sunny) {
            return 'person-sunny';
        } else if (tempType <= TEMP_TYPES.cold) {
            return 'person-cold';
        } else {
            return 'person-normal';
        }
    }
}