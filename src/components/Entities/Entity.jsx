import { Component, createRef } from "react"
import { randArray } from "../../utils"
import { TEMP_TYPES } from "../../constants"

export default class Entity extends Component {
    constructor(props) {
        super(props)

        this.baseClassName = ''

        this.state = {
            moving: false,
            entity: null,
            fadeDespawnAnim: false
        }

        this.spawnChancesConfig = {
            minTime: 5000,
            chancePerTick: 1
        }

        this.maxTimeOnScreen = 15000

         /** @private */
        this.spawnChances = {}

        this.debugKey = ''

         /** @private */
        this.spawnedTick = props.tick
         /** @private */
        this.despawnedTick = props.tick

        this.element = createRef()
    }

    /** @private */
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
    
                    if (this.state.moving) {
                        this.startDespawn('particle')
                    } else {
                        this.trySpawn()
                        if (!this.state.entity) console.log(`Could not spawn [${this.baseClassName}] using debugkeys because it's not in the correct weather condition.`)
                    }
                }  
            })
        }

        this.validate()
    }

    /** @private */
    updateSpawnChances() {
        const propertiesToCheck = ['minTime', 'maxTime', 'chancePerTick']

        for (const prop of propertiesToCheck) {
            if (this.spawnChancesConfig[prop] !== undefined) {
                if (Array.isArray(this.spawnChancesConfig[prop])) {
                    this.spawnChances[prop] = randArray(this.spawnChancesConfig[prop])
                } else {
                    this.spawnChances[prop] = this.spawnChancesConfig[prop]
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevProps.weather.id !== this.props.weather.id ) this.handleWeatherUpdate(this.props.weather)
        if (prevProps.tick !== this.props.tick) this.handleTickUpdate(this.props.tick)
    }

    /** @private */
    handleWeatherUpdate(weather) {
        const entity = this.getEntityToSpawn(weather)

        if ( !entity && this.state.moving ) {
            // entity is on screen in a weather that should not spawn, so let's despawn it.
            this.startDespawn()
        }
    }

    /** @private */
    handleTickUpdate(tick) {
        if (!this.state.moving) {
            if ( !this.rollSpawnChance(tick) ) return

            this.trySpawn()

        } else {
            if (tick > this.spawnedTick + this.maxTimeOnScreen) {
                this.startDespawn() // took too long to despawn.
            }
        }
    }

    getEntityToSpawn(weather) {
        return null
    }

    /** @private */
    trySpawn() {
        const entity = this.getEntityToSpawn(this.props.weather)
        if (!entity) return

        this.setEntity(entity)
        this.spawn()
    }

    /** @private */
    setEntity(entity) {
        this.setState({ entity })
    }

    isExtremeTemperature() {
        if (!this.props.weather) return false
        const { tempType } = this.props.weather
        return tempType <= TEMP_TYPES.veryCold || tempType >= TEMP_TYPES.verySunny
    }

    spawn() {
        this.setState({ moving: true, fadeDespawnAnim: false })
        this.spawnedTick = this.props.tick
    }

    /** 
     * This will despawn using a animation
     * @param {'fade' | 'particle' | 'none'} animationType - `(default: 'fade')` animation type that the entity will dissapear, 
     * keep in mind that `fade` take a bit more long for the entity to despawn.
     * @private 
     */
    startDespawn(animationType = 'fade') {

        if (animationType === 'fade') {
            this.setState({ fadeDespawnAnim: true })
            setTimeout(() => {
                if (!this.state.fadeDespawnAnim) return
                this.despawn()
            }, 1000)
            return
        }
        
        if (animationType === 'particle') {
            this.spawnParticle()
        }

        this.despawn()
    }

    despawn() {
        if (!this.state.moving) return

        this.setState({ moving: false, fadeDespawnAnim: false })
        this.despawnedTick = this.props.tick

        this.updateSpawnChances()
    }

    /** @private */
    spawnParticle() {
        this.props.particles.current.addParticle(this)
    }

    /** @private */
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

    /** @private */
    handleAnimationEnd(e) {
        if (e.animationName === 'move') {

            // Move animation fully completed.
            this.despawn()
        }
    }

    /** @private */
    composeClassName() {
        const classes = [this.baseClassName]
        
        if (this.state.moving) classes.push('move')

        if (this.props.weather.tempType >= TEMP_TYPES.sunny) classes.push('sunny')
        else if (this.props.weather.tempType <= TEMP_TYPES.cold) classes.push('cold')

        if (this.props.weather.isRaining) classes.push('rain')

        if (this.state.entity && this.state.entity.customClass) classes.push(this.state.entity.customClass)

        if (this.state.fadeDespawnAnim) classes.push('fade')

        return classes.join(' ')
    }
    
    /** @private */
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

    /** @private */
    validate() {
        if (!this.baseClassName) throw new Error(`Entity with no baseClassName`)
        if (!this.props.particles) throw new Error(`${this.baseClassName} has no particles prop`)
        if (!this.props.weather) throw new Error(`${this.baseClassName} has no weather prop`)
        if (this.props.tick == null) throw new Error(`${this.baseClassName} has no tick prop`)
    }
    
}