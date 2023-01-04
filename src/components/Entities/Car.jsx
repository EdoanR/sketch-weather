import { Component, createRef } from "react";
import { ENTITIES_IDS, TEMP_TYPES } from "../../constants";
import { randArray } from "../../utils";
// import Entity from "./Entity";

export default class Car extends Component {
    constructor(props) {
        super(props)
        
        this.entityClass = ENTITIES_IDS.car

        this.spawnChancesConfig = {
            minTime: 5000,
            chancePerTick: 1
        }

        this.lastSpawnTick = 0
        this.maxSpawnTime = 10000

        this.spawnChances = {}
        this.updateSpawnChances()

        this.lastDespawnTick = Date.now()

        this.state = {
            moving: false,
            spriteClass: ''
        }

        this.element = createRef()

    }

    onClick(e) {
        this.despawn(true)
    }

    spawn() {
        this.setState({ moving: true })
        this.lastSpawnTick = Date.now()
    }

    despawn(addParticle = false) {

        if (addParticle) this.props.particles.current.addParticle(this.element.current)

        this.setState({ moving: false })
        this.lastDespawnTick = this.props.tick
        this.updateSpawnChances()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tick !== this.props.tick) this.handleTickChange(this.props.tick)

        if (!this.props.weather || (prevProps.weather && prevProps.weather.id === this.props.weather.id)) return

        this.handleDataChange(this.props.weather)
    }

    hasSpawnCondition(weather) {
        if (weather.temp <= -10) return false
        return true
    }

    handleDataChange(weather) {

        if (!this.hasSpawnCondition(weather)) {
            if (this.state.moving) this.despawn(true)
            return
        }

        const spriteClass = this.getSpriteClass(weather) || ''
        this.setState({ spriteClass: spriteClass })
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

    handleAnimationEnd(e) {
        if (e.animationName === 'move') {

            // Move animation fully completed.
            this.despawn()
        }
    }

    rollSpawnChance(tick = null) {
        if (tick) {
            const maxTick = this.spawnChances.maxTime == null ? null : this.lastDespawnTick + this.spawnChances.maxTime
            const minTick = this.spawnChances.minTime == null ? null : this.lastDespawnTick + this.spawnChances.minTime

            if (minTick && tick <= minTick) return false
            if (maxTick && tick >= maxTick) return true
        }

        const chance = this.spawnChances.chancePerTick ?? 1
        return Math.random() <= chance
    }

    handleTickChange(tick) {
        if (!this.props.weather) return

        if (!this.state.moving) {

            if ( !this.hasSpawnCondition(this.props.weather) ) return
            if ( !this.rollSpawnChance(tick) ) return

            this.spawn()
        } else {
            if (tick >= this.lastSpawnTick + this.maxSpawnTime) 
                this.despawn() // Took too long to despawn, maybe animation end was not triggered for some reason
        }
    }

    composeClassName() {
        let classes = [this.entityClass]

        if (this.state.moving) classes.push('move')
        if (this.state.spriteClass) classes.push(this.state.spriteClass)

        return classes.join(' ')
    }

    updateSpawnChances() {
        const propertiesToCheck = ['minTime', 'maxTime', 'chancePerTick'];

        for (const prop of propertiesToCheck) {
            if (this.spawnChancesConfig[prop] !== undefined) {
                if (Array.isArray(this.spawnChancesConfig[prop])) {
                    this.spawnChances[prop] = randArray(this.spawnChancesConfig[prop]);
                } else {
                    this.spawnChances[prop] = this.spawnChancesConfig[prop];
                }
            }
        }
    }

    render() {
        return <div ref={this.element} onAnimationEnd={(e) => this.handleAnimationEnd(e)} className={this.composeClassName()} onClick={(e) => this.onClick(e)} />
    }
}