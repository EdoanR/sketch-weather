import SmallButton from '../SmallButton';
import icon from '/images/icons/static/key.png';
import animatedIcon from '/images/icons/animated/key.gif';

export default function ModalButton(props) {
    return <SmallButton {...props} icon={icon} animatedicon={animatedIcon} tooltip="Change API key"/>
}