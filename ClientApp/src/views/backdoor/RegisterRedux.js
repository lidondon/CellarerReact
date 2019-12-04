import { setLoginData } from '../../utilities/authentication';
import { assembleErrorMsg } from '../../utilities/util';

const REGISTER = "REGISTER";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const initialState = {
    isLoading: false,
    error: null
}

export function register(email, password, type, serialNo) {
    return {
        type: REGISTER,
        statuses: [ LOADING, SUCCESS, ERROR ],
        method: "post",
        baseUrl: "http://ec2-3-112-213-86.ap-northeast-1.compute.amazonaws.com:8083",
        url: "/api/v1/identity/register",
        params: {
            email,
            password,
            type,
            serialNo
        }
    };
}

function reducer(state = initialState, action) {
    let resultCase = {
        REGISTER: processRegister
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processRegister = (state, action) => {
    let error = assembleErrorMsg(REGISTER, action.error);

    if (action.status === SUCCESS && action.payload) setLoginData(action.payload.token, action.payload.refreshToken);

    return {
        ...state,
        isLoading: action.isLoading,
        error
    };
}

export default reducer;