import { setLoginData } from '../utilities/authentication';
import { assembleErrorMsg } from '../utilities/util';

const AUTH_BASE_URL = "http://ec2-3-112-213-86.ap-northeast-1.compute.amazonaws.com:8083";
const LOGIN_URL = "/api/v1/identity/login";
const LOGIN = "LOGIN";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const initialState = {
    isLoading: false,
    error: ""
}

export function login(email, password) {
    return {
        type: LOGIN,
        statuses: [ LOADING, SUCCESS, ERROR ],
        method: "post",
        baseUrl: AUTH_BASE_URL,
        url: LOGIN_URL,
        params: {
            email,
            password
        }
    };
}

function reducer(state = initialState, action) {
    let resultCase = {
        LOGIN: processLogin
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processLogin = (state, action) => {
    let error = assembleErrorMsg(LOGIN, action.error);
    if (action.status === SUCCESS && action.payload) {
        setLoginData(action.payload.token, action.payload.refreshToken, action.params.email);
    }

    return {
        ...state,
        isLoading: action.isLoading,
        error: error
    };
}

export default reducer;