import './index.scss';

export default function ConfigButton({ onClick }) {
    return (
        <div onClick={onClick} className="config-button border-anim-hover">
            <div className="cog-icon"></div>
        </div>
    )
}