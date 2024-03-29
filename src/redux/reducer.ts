import {Dispatch} from 'redux';

export type settingNamesType = "max" | "start"
type settingType = {
    title: string
    value: number
}
export type settingsType = {
    max: settingType
    start: settingType
}
export type SettingsStateType = {
    currentNumber: number
    settingParameters: settingsType
    editMode: boolean
    colorScheme: string
    isBroken: boolean
}

const initialState: SettingsStateType = {
    currentNumber: 0,
    settingParameters: {
        max: {
            title: 'max value:',
            value: 5,
        },
        start: {
            title: 'start value:',
            value: 0,
        }
    },
    editMode: false,
    colorScheme: "",
    isBroken: false
};
type ActionsType = IncCounterAT | ResetCounterAT | SetSettingsAT | SetNewValueAT | SetSettingsFromLocalStorageAT
    | SetColorAT | ToggleBrokenAT;

export const Reducer = (state: SettingsStateType = initialState, action: ActionsType): SettingsStateType => {
    switch (action.type) {
        case 'INC_COUNTER':
            if (state.currentNumber < state.settingParameters.max.value) {
                let newNum = state.currentNumber + 1;
                return {
                    ...state,
                    currentNumber: newNum
                }
            }
            return state;
        case 'RESET_COUNTER':
            return {
                ...state,
                currentNumber: state.settingParameters.start.value
            };
        case 'SET_SETTINGS':
            return {
                ...state,
                editMode: false,
                currentNumber: state.settingParameters.start.value
            }
        case 'SET_NEW_VALUE':
            return {
                ...state,
                settingParameters: {
                    ...state.settingParameters,
                    [action.valueType]: {
                        ...state.settingParameters[action.valueType],
                        value: action.newValue
                    }
                },
                editMode: true
            }
        case 'SET_SETTINGS_FROM_LS':
            return {
                ...state,
                settingParameters: action.settingsFromLS,
                currentNumber: action.settingsFromLS.start.value
            }
        case 'SET_COLOR':
            return {
                ...state,
                colorScheme: action.color,
                editMode: true
            }
        case 'SET_BROKEN':
            return {
                ...state,
                isBroken: action.broken,
            }
        default:
            return state;
    }
}

type IncCounterAT = {
    type: 'INC_COUNTER'
}
type ResetCounterAT = {
    type: 'RESET_COUNTER'
}
type SetSettingsAT = {
    type: 'SET_SETTINGS'
}
type SetNewValueAT = {
    type: 'SET_NEW_VALUE'
    valueType: settingNamesType
    newValue: number
}
type SetSettingsFromLocalStorageAT = {
    type: 'SET_SETTINGS_FROM_LS'
    settingsFromLS: settingsType
}
type SetColorAT = {
    type: 'SET_COLOR'
    color: string
}
type ToggleBrokenAT = {
    type: 'SET_BROKEN'
    broken: boolean
}

export const incCounterAC = (): IncCounterAT => ({type: 'INC_COUNTER'});
export const resetCounterAC = (): ResetCounterAT => ({type: 'RESET_COUNTER'});
export const setSettingsAC = (): SetSettingsAT => ({type: 'SET_SETTINGS'});
export const setNewValueAC = (valueType: settingNamesType, newValue: number): SetNewValueAT => {
    return {
        type: 'SET_NEW_VALUE',
        valueType,
        newValue
    }
};
export const setSettingFromLocalStorageAC = (settingsFromLS: settingsType): SetSettingsFromLocalStorageAT => {
    return {
        type: 'SET_SETTINGS_FROM_LS',
        settingsFromLS
    }
}
export const setColorAC = (color: string): SetColorAT => {
    return {
        type: 'SET_COLOR',
        color
    }
}
export const toggleBrokenAC = (broken: boolean): ToggleBrokenAT => {
    return {
        type: 'SET_BROKEN',
        broken
    }
}

export const getSettingsFromLocalStorage = () => {
    return (dispatch: Dispatch) => {
        const valueFromLocalStorage = localStorage.getItem('counterValues');
        const colorFromLocalStorage = localStorage.getItem('colorSchema');
        const isBrokenFromLocalStorage = localStorage.getItem('appBroken');
        if(valueFromLocalStorage){
            const initialSettings = JSON.parse(valueFromLocalStorage);
            dispatch(setSettingFromLocalStorageAC(initialSettings));
        }
        if(colorFromLocalStorage){
            const initialColor = JSON.parse(colorFromLocalStorage);
            dispatch(setColorAC(initialColor));
            dispatch(setSettingsAC());
        }
        if(isBrokenFromLocalStorage){
            const initialBrokenStatus = JSON.parse(isBrokenFromLocalStorage);
            dispatch(toggleBrokenAC(initialBrokenStatus));
        }
    }
}

export const setNewSettings = (settingParameters: settingsType, colorScheme: string) => {
    return (dispatch: Dispatch) => {
        localStorage.setItem('counterValues', JSON.stringify(settingParameters))
        localStorage.setItem('colorSchema', JSON.stringify(colorScheme))
        dispatch(setSettingsAC());
    }
}

export const toggleBrokenThunk = (broken: boolean) => {
    return (dispatch: Dispatch) => {
        localStorage.setItem('appBroken', JSON.stringify(broken))
        localStorage.setItem('colorSchema', JSON.stringify(""))
        dispatch(toggleBrokenAC(broken));
    }
}


