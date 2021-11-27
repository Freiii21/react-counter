import s from './Button.module.css'
import {settingsType} from '../../App';

type ButtonsPropsType = {
    title: string
    currentNumber: number
    onClick: () => void
    settingParameters: settingsType
}

export const Button = (props: ButtonsPropsType) => {
    const onClickHandler = () => {
        props.onClick();
    }

    let disable: boolean;
    switch (props.title) {
        case 'inc':
            disable = props.currentNumber === props.settingParameters.max.value;
            break;
        case 'reset':
            disable = props.currentNumber === props.settingParameters.start.value;
            break;
        default:
            disable = false;
            break;
    }
    const usualClass = props.title === 'set' ? `${s.usual} ${s.singleButton}` : s.usual;
    const buttonClass = disable ? `${usualClass} ${s.disabled}` : usualClass;

    return (
        <button className={buttonClass} onClick={onClickHandler} disabled={disable}>
            {props.title}
        </button>
    )
}