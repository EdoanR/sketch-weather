import { Component, createRef } from "react";
import { randArray } from "../../utils";
import { TEMP_TYPES } from "../../constants"

export default class Entity extends Component {
    constructor(props) {
        super(props)
        
        this.entityClass = 'entity-class'

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 10000,
            chancePerTick: 0.1
        }

        this.spawnChances = {}

        this.state = {
            moving: false,
            spriteClass: '',
            className: '',
            entity: null
        }

        this.lastSpawnTick = 0
        this.maxTimeOnScreen = 10000
        this.lastDespawnTick = Date.now()

        this.element = createRef()

    }
    
    componentDidMount() {
        this.updateSpawnChances()
        this.validate()
    }

    onClick(e) {
        this.despawn(true)
    }

    spawn() {
        this.setState({ moving: true })
        this.lastSpawnTick = this.props.tick
    }

    despawn(addParticle = false) {

        if (addParticle) this.spawnParticles()

        this.setState({ moving: false })
        this.lastDespawnTick = this.props.tick
        this.updateSpawnChances()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tick !== this.props.tick) this.handleTickChange(this.props.tick)

        if (!this.props.weather || (prevProps.weather && prevProps.weather.id === this.props.weather.id)) return

        this.handleWeatherChange(this.props.weather)
    }

    isInSpawnCondition(weather) {
        return true
    }

    handleWeatherChange(weather) {

        if (!this.isInSpawnCondition(weather)) {
            if (this.state.moving) this.despawn(true)
            return
        }

        const spriteClass = this.getEntity(weather) || ''

        // Spawn particles when entity change sprite on screen.
        if (this.state.moving && spriteClass !== this.state.spriteClass) {
            this.spawnParticles()
        }
        
        console.log('setting className')
        this.setState({ spriteClass: spriteClass, className: this.composeClassName() })
    }

    getEntity({ tempType, temp }) {
        return null
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

            if ( !this.isInSpawnCondition(this.props.weather) ) return
            if ( !this.rollSpawnChance(tick) ) return

            this.spawn()
        } else {
            if (tick >= this.lastSpawnTick + this.maxTimeOnScreen) 
                this.despawn() // Took too long to despawn, maybe animation end was not triggered for some reason
        }
    }

    composeClassName() {
        let classes = [this.entityClass]

        if (this.state.moving) classes.push('move')
        // if (this.state.spriteClass) classes.push(this.state.spriteClass)

        if (this.props.weather) {
            console.log(this.props.weather.tempType)
            classes.push(this.props.weather.isDay ? 'day' : 'night')
            if (this.props.weather.isRaining) classes.push('rain')
            if (this.props.weather.tempType >= TEMP_TYPES.sunny) classes.push('sunny')
            if (this.props.weather.tempType <= TEMP_TYPES.cold) classes.push('cold')
        }

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

    spawnParticles() {
        this.props.particles.current.addParticle(this.element.current)
    }

    validate() {
        if (!this.entityClass) throw new Error('Entity has no entityClass')
        if (!this.props.tick && this.props.tick !== 0) throw new Error(`Entity with no tick prop`)
        if (!this.props.particles) throw new Error(`Entity with no particles prop`)
    }

    render() {
        console.log('redering...')
        return (
            <div 
                ref={this.element} 
                onAnimationEnd={(e) => this.handleAnimationEnd(e)} 
                className={this.state.className} 
                onClick={(e) => this.onClick(e)} 
            />
        )
        
    }
}