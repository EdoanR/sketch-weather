import './SoundControl.scss';

export default function SoundControl({ soundCtrl, setSoundCtrl }) {

    function handleInputRangeChange(e) {
        setSoundCtrl( v => ({...v, volume: parseFloat(e.target.value)}) );
    }

    function handleMuteButtonClick(e) {
        setSoundCtrl( v => ({...v, muted: !v.muted}) );
    }
    
    return (
        <div className="volume-control border-static">
            <div onClick={handleMuteButtonClick} className={"mute-button" + (soundCtrl.muted ? ' muted' : '')} />
            <input type="range" onChange={handleInputRangeChange} value={soundCtrl.volume} max={2} min={0} step={0.1}/>
        </div>
    )
}