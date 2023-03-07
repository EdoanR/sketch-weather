import './ConfigSideBar.scss';

export default function ConfigSideBar({ configOpen, onConfigClose }) {

    return (
        <>
            <div onClick={onConfigClose} className={"backdrop" + (configOpen ? ' open' : '')} />
            <div className={"config-sidebar" + (configOpen ? ' open' : '')}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </>
    )
}