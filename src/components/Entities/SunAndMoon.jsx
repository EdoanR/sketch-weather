import { Component } from "react";
import { lerp } from "../../utils";
import entities from "../EntitiesList/entities";

export default class SunAndMoon extends Component {
    constructor(props) {
        super(props);

        this.baseClassName = 'sun-moon';

        this.state = {
            posY: 0,
            entity: entities.sun
        }
    }

    componentDidMount() {
        this.onWeatherUpdate(this.props.weather);
    }

    handleClick() {
        if (!this.state.entity) return
        this.props.onEntityCollected(this.state.entity)
    }

    componentDidUpdate(prevProps, prevStates) {
        if (this.hasWeatherUpdated(prevProps.weather, this.props.weather)) {
            this.onWeatherUpdate(this.props.weather);
        } 
    }

    hasWeatherUpdated(prevWeather, weather) {
        if (!prevWeather && weather) return true;
        if (prevWeather.time !== weather.time) return true;
        if (prevWeather.cycle !== weather.cycle) return true;
        if (prevWeather.isDay !== weather.isDay) return true;
        return false;
    }

    onWeatherUpdate(weather) {
        this.setState({
            entity: weather.isDay ? entities.sun : entities.moon,
            posY: this.getPosY(weather)
        })
    }

    getPosY(weather) {
        const value = weather.cycle
        const max = 50
        const min = 192

        return lerp(min, max, value)
    }

    render() {
        return (
            <div 
                onClick={(e) => { this.handleClick(e) }}
                className={this.baseClassName + ' ' + (this.state.entity ? this.state.entity.customClass : '')} 
                style={{ bottom: `${this.state.posY}px` }}
            />
        )
    }
}