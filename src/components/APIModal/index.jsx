import ReactModal from "react-modal";
import './index.scss';

export default function APIModal({ modalIsOpen, setModalIsOpen, apiKey, setApiKey, onAfterAPISubmit }) {

    function closeModal() {
        setModalIsOpen(false);
    }

    function handleInputChange(e) {
        setApiKey(e.target.value);
        localStorage.setItem('api-key', e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key !== 'Enter') return;
        closeModal();
        if (onAfterAPISubmit) onAfterAPISubmit();
    }

    return (
        <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="API modal"
            className={"modal border-static" + (!modalIsOpen ? ' modal-close' : '')}
            overlayClassName={"modal-overlay" + (modalIsOpen ? ' modal-open' : '')}
            portalClassName="modal-portal"
            closeTimeoutMS={250}
        >
            <h2>API Key</h2>
            <p>API key is necessary to obtain weather data, you can get one by creating an account on <a href="https://openweathermap.org" target='_blank'>OpenWeather</a></p>
            <label htmlFor="">
                <span>API key:</span>
                <input type="text" onChange={handleInputChange} onKeyDown={handleKeyDown} className='border-static' placeholder='Paste the API key here...' value={apiKey} />
            </label>
        </ReactModal>
    );
}