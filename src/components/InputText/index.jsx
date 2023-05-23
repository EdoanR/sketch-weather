import { useState, forwardRef } from "react";

const InputText = forwardRef((props, ref) => {

    const [timeoutId, setTimeoutId] = useState(null);
    const { className, onChange, ...restProps } = props;

    const handleInputChange = (e) => {
        if (onChange) onChange(e);
        if (timeoutId) return;

        e.target.classList.toggle('border-1');
        e.target.classList.toggle('border-2');

        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => {
        setTimeoutId(null);
        }, 100));
    };

    return (
        <input 
            ref={ref}
            className={'input-text border-1' + (props.className ? ' ' + props.className : '')} 
            onChange={handleInputChange} 
            type="text"
            {...restProps}
        />
    )
});

export default InputText;