import { Component, createRef } from "react";
import { randArray } from "../../utils";
import { TEMP_TYPES } from "../../constants"

export default class Entity extends Component {
    constructor(props) {
        super(props)

        this.baseClassName = ''

        this.state = {
            moving: false,
            entity: null
        }

        this.spawnChancesConfig = {
            minTime: 5000,
            chancePerTick: 1
        }

        this.maxTimeOnScreen = 15000

        this.spawnChances = {}

        this.debugKey = ''

        this.spawnedTick = props.tick
        this.despawnedTick = props.tick

        this.element = createRef()
    }

    handleClick() {
        if (!this.state.entity) return
        this.props.onEntityCollected(this.state.entity)
    }

    componentDidMount() {
        this.updateSpawnChances()

        if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && this.debugKey) {
            document.addEventListener('keyup', ev => {
                if (ev.key === this.debugKey) {
                    ev.preventDefault()
    
                    this.state.moving ? this.despawn(true) : this.spawn()
                }  
            })
        }

        this.validate()
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

    componentDidUpdate(prevProps, prevStates) {
        if (prevProps.weather.id !== this.props.weather.id ) this.handleWeatherUpdate(this.props.weather)
        if (prevProps.tick !== this.props.tick) this.handleTickUpdate(this.props.tick)
    }

    handleWeatherUpdate(weather) {
        if ( !this.shouldSpawn(weather) && this.state.moving ) {
            // entity is on screen in a weather that should not spawn, so let's despawn it.
            this.despawn(true)
        }
    }

    shouldSpawn(weather) {
        return true
    }

    handleTickUpdate(tick) {
        if (!this.state.moving) {
            if ( !this.shouldSpawn(this.props.weather)) return
            if ( !this.rollSpawnChance(tick) ) return

            this.spawn()

        } else {
            if (tick > this.spawnedTick + this.maxTimeOnScreen) {
                this.despawn(true) // took too long to despawn.
            }
        }
    }

    spawn() {
        this.setState({ moving: true })
        this.spawnedTick = this.props.tick
    }

    despawn(addParticle = false) {

        if (addParticle) this.spawnParticle()

        this.setState({ moving: false })
        this.despawnedTick = this.props.tick

        this.updateSpawnChances()
    }

    spawnParticle() {
        this.props.particles.current.addParticle(this)
    }

    rollSpawnChance(tick = null) {
        if (tick) {
            const maxTick = this.spawnChances.maxTime == null ? null : this.despawnedTick + this.spawnChances.maxTime
            const minTick = this.spawnChances.minTime == null ? null : this.despawnedTick + this.spawnChances.minTime

            if (minTick && tick <= minTick) return false
            if (maxTick && tick >= maxTick) return true
        }

        const chance = this.spawnChances.chancePerTick ?? 1
        return Math.random() <= chance
    }

    handleAnimationEnd(e) {
        if (e.animationName === 'move') {

            // Move animation fully completed.
            this.despawn()
        }
    }

    composeClassName() {
        const classes = [this.baseClassName]
        
        if (this.state.moving) classes.push('move')

        if (this.props.weather.tempType >= TEMP_TYPES.sunny) classes.push('sunny')
        else if (this.props.weather.tempType <= TEMP_TYPES.cold) classes.push('cold')

        if (this.props.weather.isRaining) classes.push('rain')

        if (this.state.entity && this.state.entity.customClass) classes.push(this.state.entity.customClass)

        return classes.join(' ')
    }
    
    render() {
        return (
            <div 
                onClick={(e) => { this.handleClick(e) }}
                onAnimationEnd={(e) => { this.handleAnimationEnd(e) }} 
                className={this.composeClassName()} 
                ref={this.element}
            />
        )
    }

    validate() {
        if (!this.baseClassName) throw new Error(`Entity with no baseClassName`)
        if (!this.props.particles) throw new Error(`${this.baseClassName} has no particles prop`)
        if (!this.props.weather) throw new Error(`${this.baseClassName} has no weather prop`)
        if (this.props.tick == null) throw new Error(`${this.baseClassName} has no tick prop`)
    }
    
}