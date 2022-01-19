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
    editMode: false
};
type ActionsType = IncCounterAT | ResetCounterAT | SetSettingsAT | SetNewValueAT | SetSettingsFromLocalStorageAT;

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

export const setNewSettings = (settingParameters: settingsType) => {
    return (dispatch: Dispatch) => {
        localStorage.setItem('counterValues', JSON.stringify(settingParameters))
        dispatch(setSettingsAC());
    }
}
export const getSettingsFromLocalStorage = () => {
    return (dispatch: Dispatch) => {
        const valueFromLocalStorage = localStorage.getItem('counterValues');
        if(valueFromLocalStorage){
            const initialSettings = JSON.parse(valueFromLocalStorage);
            dispatch(setSettingFromLocalStorageAC(initialSettings));
        }
    }
}


