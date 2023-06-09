import ReactModal from "react-modal";
import './index.scss';

export default function Modal({ isOpen, setIsOpen, className= '', children, ...restProps }) {

    function closeModal() {
        setIsOpen(false);
    }

    function composeClassName() {
        const classes = ['modal', 'border-static'];
        if (className) classes.push(className);
        if (!isOpen) classes.push('modal-close');

        return classes.join(' ');
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="API modal"
            className={composeClassName()}
            overlayClassName={"modal-overlay" + (isOpen ? ' modal-open' : '')}
            portalClassName="modal-portal"
            closeTimeoutMS={250}
            {...restProps}
        >
            <button type="button" className="close-button" onClick={closeModal}>x</button>

            { children }
        </ReactModal>
    );
}