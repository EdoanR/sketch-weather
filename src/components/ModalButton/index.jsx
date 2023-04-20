import './index.scss';

export default function ModalButton({ onClick }) {

    function handleMuteButtonClick(e) {
        onClick(e);
    }

    return (
        <div className="modal-button border-static tooltip-element" onClick={handleMuteButtonClick} data-tooltip-id='tooltip' data-tooltip-content='Change API key'>
            <div className="icon"/>
        </div>
    )
}