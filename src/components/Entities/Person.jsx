import { ENTITIES_IDS } from "../../constants";
import Entity from "./Entity";

export default class Person extends Entity {
    constructor(props) {
        super(props)

        this.className = ENTITIES_IDS.personNormal
        
    }
}