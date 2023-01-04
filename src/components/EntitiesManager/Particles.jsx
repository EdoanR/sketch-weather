import { randId, randNumber } from '../../utils'
import { Component } from "react";

export default class Particles extends Component {
    constructor(props) {
        super(props)

        this.state = {
            particles: []
        }
    }

    addParticle(element) {
        if (!element) return

        const width = (element.clientWidth > element.clientHeight ? element.clientWidth : element.clientHeight) / 1.25

        // This values will be set to the new/reused particle.
        const overwrite = {
            x: element.offsetLeft + (element.clientWidth / 2) - (width / 2),
            y: element.offsetTop + (element.clientHeight / 2) - (width / 2),
            w: width,
            h: width,
            active: true,
            rot: randNumber(0, 180)
        }

        let particleId = null

        const particleIndex = this.state.particles.findIndex(p => !p.active)
        if (particleIndex !== -1) {
            // Reuse an inactivy particle

            const newParticles = [...this.state.particles]
            newParticles[particleIndex] = {...newParticles[particleIndex], ...overwrite}

            particleId = newParticles[particleIndex].id

            this.setState({ particles: newParticles })

        } else {
            // Create a new particle

            particleId = randId()

            this.setState({
                particles: [...this.state.particles, {
                    id: particleId,
                    ...overwrite
                }]
            })
        }

        // Disable it after 1 second
        setTimeout(() => {
            this.setState({
                particles: [...this.state.particles.map(p => {
                    if (p.id === particleId) p.active = false
                    return p
                })]
            })
        }, 1000)
    }

    render() {

        return <>
            {this.state.particles.map(p => {
                return <div 
                    className={p.active ? 'particle' : ''}
                    key={p.id} 
                    style={{
                        left: p.x,
                        top: p.y,
                        width: p.w,
                        height: p.h,
                        transform: `rotate(${p.rot}deg)`
                    }}></div>
            })}
        </>
    }
}