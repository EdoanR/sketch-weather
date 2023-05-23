import ReactModal from "react-modal";
import InputText from "../InputText";
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
            <button type="button" className="close-button" onClick={closeModal}>x</button>
            <h2>API Key</h2>
            <p>API key is necessary to obtain weather data, you can get one by creating an account on <a href="https://home.openweathermap.org/users/sign_in" target='_blank'>OpenWeather</a>. Then going to your <a href="https://home.openweathermap.org/api_keys" target="_blank">API page</a>.</p>
            <label htmlFor="">
                <span>Paste the API key here:</span>
                <InputText 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown} 
                    placeholder='Paste the API key here...' 
                    value={apiKey} 
                    style={{
                        width: 320,
                        height: 50,
                        textAlign: 'center'
                    }}
                />
            </label>
        </ReactModal>
    );
}