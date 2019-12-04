import { intIds2Strings } from '../../utilities/util';

import { LOADING, SUCCESS, ERROR } from '../../constants/http';

const SELECTED_ID_CHANGED = "SELECTED_ID_CHANGED";
const GET_MENUS = "GET_MENUS";
const GET_MENUS_URL = "/api/v1/cellarer/menus";

const initialState = {
    selectedId: "",
    menus: []
}

export function selectedIdChanged(id) {
    return {
        type: SELECTED_ID_CHANGED,
        payload: id
    };
}

export const getMenus = (startDate, endDate) => {
    return {
        type: GET_MENUS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_MENUS_URL
    };
}

function reducer(state = initialState, action) {
    let resultCase = {
        SELECTED_ID_CHANGED: processSelectedIdChanged,
        GET_MENUS: processGetMenus
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processSelectedIdChanged = (state, action) => {
    return {
        ...state,
        selectedId: action.payload 
    };
}

const processGetMenus = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
        result.menus = intIds2Strings(action.payload);
    }

    return result;
}

const getBaseAxiosResult = (state, action) => {
    return {
        ...state,
        isLoading: action.isLoading,
        error: action.error
    };
}

export default reducer;