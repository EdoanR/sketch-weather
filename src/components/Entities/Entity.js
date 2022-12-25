import { Component } from "react";
import { CLASSES } from "../../constants";

// Sprites are in the entity.scss
export default class Entity extends Component {

    constructor(props) {
        super(props)

        this.className = ''

        this.state = {
            collectable: false,
            collected: false
        }
    }

    composeClassName() {
        let className = this.className

        if (this.state.collectable) className += ' ' + CLASSES.collectable
        if (this.state.collected) className += ' ' + CLASSES.collected

        return className
    }

    handleClick(e) {

        if (!this.state.collectable || this.state.collected) return

        this.setState({ collected: true, collectable: false })
        
    }

    render() {
        return <div className={this.composeClassName()} onClick={(e) => this.handleClick(e)} />
    }
}