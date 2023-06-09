import { EntitiesContext } from "../../contexts/EntitiesContext";
import { useContext } from "react";
import Modal from "../Modal";
import SmallButton from "../SmallButton";

export default function ResetCollectionModal({ isOpen, setIsOpen }) {
    const { entities, setEntities } = useContext( EntitiesContext )

    function handleYesClick() {
        setEntities(v => {
            const newEntities = {...v};
            Object.keys(newEntities).forEach(k => {
                newEntities[k].collected = false;
                newEntities[k].pop = false;
                newEntities[k].bubbleAnim = false;
                newEntities[k].bright = false;
            });

            return newEntities;
        });

        localStorage.removeItem('collected-entities');
        setIsOpen(false);
    }

    function handleNoClick() {
        setIsOpen(false);
    }

    const entitiesArray = Object.values(entities);
    const collectedEntities = entitiesArray.filter(en => en.collected);

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            contentLabel="Reset collection modal"
        >
            <p>{`This will clear all your collected entities (${collectedEntities.length}/${entitiesArray.length}).`}</p>
            <p>Are you sure?</p>

            <div style={{ display: 'inline-flex', gap: 5 }}>
                <SmallButton style={{ width: 80, color: '#ff7b7b', fontSize: '1.25em' }} onClick={handleYesClick}>Yes!</SmallButton>
                <SmallButton style={{ width: 80, color: 'lime', fontSize: '1.25em' }} onClick={handleNoClick}>Nop</SmallButton>
            </div>
        </Modal>
    );
}