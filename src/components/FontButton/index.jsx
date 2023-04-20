import { useEffect, useState } from 'react';
import './index.scss';

export default function FontButton() {
    const [altFontState, setAltFontState] = useState(false);

    useEffect(() => {
        // Load the previous state from localStorage on mount
        const savedState = localStorage.getItem('isBodyClassAdded');
        if (savedState !== null) {
            setAltFontState(JSON.parse(savedState));
        }
    }, []);

    useEffect(() => {
        // Save the current state to localStorage on update
        localStorage.setItem('isBodyClassAdded', JSON.stringify(altFontState));
    }, [altFontState]);

    const handleClick = () => {
        setAltFontState(!altFontState);
    };

    useEffect(() => {
        // Add/remove the class to the body element when the state changes
        if (altFontState) {
            document.body.classList.add('font-alt');
        } else {
            document.body.classList.remove('font-alt');
        }
    }, [altFontState]);

    return <div onClick={handleClick} className='font-button border-anim-hover tooltip-element' data-tooltip-id='tooltip' data-tooltip-content='Change font'>
        <div>Abc</div>
    </div>
}