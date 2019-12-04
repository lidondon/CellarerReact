import { assembleErrorMsg } from '../utilities/util';

export const SERVER_ERROR = "SERVER_ERROR";
export const CLEAR_SERVER_ERROR = "SERVER_ERROR";

const initialState = {
    serverError: null
}

export const clearServerError = () => {
    return {
        type: CLEAR_SERVER_ERROR
    };
}

function reducer(state = initialState, action) {
    let resultCase = {
        CLEAR_SERVER_ERROR: processClearServerError,
        SERVER_ERROR: processServerError
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processClearServerError = (state, action) => {
    return { 
        ...state,
        serverError: null
     };
}

const processServerError = (state, action) => {
    return { 
        ...state,
        serverError: assembleErrorMsg(SERVER_ERROR, action.error)
     };
}

export default reducer;