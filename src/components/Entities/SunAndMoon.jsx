import { Component, createRef } from "react";
import { lerp } from "../../utils";

export default class SunAndMoon extends Component {
    constructor(props) {
        super(props);

        this.baseClassName = 'sun-moon';

        this.state = {
            posY: 0,
            entity: null,
            popAnim: false
        }

        this.element = createRef()
    }

    componentDidMount() {
        this.onWeatherUpdate(null, this.props.weather);
    }

    handleClick() {
        if (!this.state.entity) return
        this.props.collectEntity(this.state.entity)
    }

    componentDidUpdate(prevProps, prevStates) {
        if (this.hasWeatherUpdated(prevProps.weather, this.props.weather)) {
            this.onWeatherUpdate(prevProps.weather, this.props.weather);
        }

        if (this.hasEntityUpdated(prevStates.entity, this.state.entity)) {
            this.onEntityUpdate(prevStates.entity, this.state.entity);
        }
    }

    hasWeatherUpdated(prevWeather, weather) {
        if (!prevWeather && weather) return true;
        if (prevWeather.time !== weather.time) return true;
        if (prevWeather.cycle !== weather.cycle) return true;
        if (prevWeather.isDay !== weather.isDay) return true;
        return false;
    }

    hasEntityUpdated(prevEntity, entity) {
        if (Boolean(prevEntity) !== Boolean(entity)) return true;
        if (prevEntity.id !== entity.id) return true;
        return false;
    }

    onWeatherUpdate(prevWeather, weather) {
        this.setState({
            entity: weather.isDay ? this.props.entities.sun : this.props.entities.moon,
            posY: this.getPosY(weather)
        })
    }

    onEntityUpdate(prevEntity, entity) {
        this.playPopAnimation();
    }

    playPopAnimation() {
        this.setState({
            popAnim: true
        });
    }

    getPosY(weather) {
        const value = weather.cycle
        const max = 50
        const min = 192

        return lerp(min, max, value)
    }

    handleAnimationEnd(e) {
        if (e.animationName === 'pop') {
            this.setState({
                popAnim: false
            });
        }
    }

    composeClassName() {
        const classes = [this.baseClassName]

        if (this.state.entity) {
            classes.push(`entity-${this.state.entity.keyName}`);
            
            if (this.state.entity.customClass) classes.push(this.state.entity.customClass)
            if (this.state.entity.collected) {
                classes.push('collected')
            } else {
                classes.push('collectable')
            }
        }

        if (this.state.popAnim) classes.push('pop-anim');

        return classes.join(' ')
    }

    render() {
        return (
            <div 
                ref={this.element}
                onClick={(e) => { this.handleClick(e) }}
                className={this.composeClassName()} 
                onAnimationEnd={(e) => { this.handleAnimationEnd(e) }}
                style={{ bottom: `${this.state.posY}px` }}
            />
        )
    }
}