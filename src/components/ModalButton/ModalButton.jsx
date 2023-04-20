import './ModalButton.scss';

export default function ModalButton({ onClick }) {

    function handleMuteButtonClick(e) {
        onClick(e);
    }

    return (
        <div className="modal-button border-static" onClick={handleMuteButtonClick} title='Change API key'>
            <div className="icon"/>
        </div>
    )
}