import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
import entities from "../EntitiesList/entities";
import Entity from "./Entity";

/**
 * Birds show up at day, owl at night.
 * Owl are a bit more rare.
 * Birds will not show up in strong rain.
 * Birds/Owls will not show up extreme cold
 */

export default class Bird extends Entity {
    constructor(props) {
        super(props)
        
        this.baseClassName = ENTITIES_CLASS_TYPES.bird

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 15000,
            chancePerTick: 0.075
        }

        this.maxTimeOnScreen = 15000
        this.debugKey = '4'
    }

    shouldSpawn({ tempType }) {
        if (tempType <= TEMP_TYPES.veryCold) return false
        return true
    }
}