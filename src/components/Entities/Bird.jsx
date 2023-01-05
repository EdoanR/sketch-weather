import { ENTITIES_IDS, TEMP_TYPES } from "../../constants";
import Entity from "./Entity";

export default class Bird extends Entity {
    constructor(props) {
        super(props)
        
        this.entityClass = ENTITIES_IDS.bird

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 15000,
            chancePerTick: 0.075
        }

        this.maxTimeOnScreen = 15000
    }

    isInSpawnCondition(weather) {
        if (weather.temp <= -10) return false
        return true
    }

    getSpriteClass({ tempType, temp }) {

        if (tempType >= TEMP_TYPES.sunny) {
            return 'bird-sunny';
        } else if (tempType <= TEMP_TYPES.cold) {
            return 'bird-cold';
        } else {
            return 'bird-normal';
        }
    }
}