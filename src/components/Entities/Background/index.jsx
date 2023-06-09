import './index.scss'

export default function Background({ weather }) {
    return <div className={`background ${weather.isSnowing ? 'snow' : ''}`} />
}