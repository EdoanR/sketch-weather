import Modal from "../Modal";
import InputText from "../InputText";
import './index.scss';

export default function APIModal({ isOpen, setIsOpen, apiKey, setApiKey, onAfterAPISubmit }) {

    function handleInputChange(e) {
        setApiKey(e.target.value);
        localStorage.setItem('api-key', e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key !== 'Enter') return;
        setIsOpen(false);
        if (onAfterAPISubmit) onAfterAPISubmit();
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            contentLabel="API modal"
            className="api-modal"
        >
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
        </Modal>
    );
}