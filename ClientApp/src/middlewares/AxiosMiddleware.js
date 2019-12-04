import axios from 'axios';
import { isLogin, getAuthToken, setLoginData, getUser } from '../utilities/authentication';

import { SERVER_ERROR } from '../views/BaseViewRedux';

//const BASE_URL = "http://localhost:5000";
const BASE_URL = "http://ec2-3-112-213-86.ap-northeast-1.compute.amazonaws.com:8086";
const AUTH_BASE_URL = "http://ec2-3-112-213-86.ap-northeast-1.compute.amazonaws.com:8083";
const AUTH_HEARDER = "Authorization";
const BEARER_PREFIX = "Bearer ";

const axiosMiddelware = store => next => action => {
    if (!action.url || !Array.isArray(action.statuses)) return next(action);
    const [ LOADING, SUCCESS, ERROR ] = action.statuses;
    const axiosConfig = {
        baseURL: (action.baseUrl) ? action.baseUrl : BASE_URL,
        method: (action.method) ? action.method : "get",
        url: action.url,
        headers: { 
            "Content-Type": "application/json",
            ...action.headers
        },
        data: action.params
    }
    
    addAuthInfoInHeader(axiosConfig.headers);
    next({
        type: action.type,
        status: LOADING,
        isLoading: true,
        ...action,
    });
    axios(axiosConfig).then(response => {
        next({
            type: action.type,
            status: SUCCESS,
            isLoading: false,
            payload: response.data,
            ...action
        });
    }).catch(error => {
        if (error.response && error.response.status === 401) {
            refreshAndRecall().then(() => {
                addAuthInfoInHeader(axiosConfig.headers);
                axios(axiosConfig).then(response => {
                    next({
                        type: action.type,
                        status: SUCCESS,
                        isLoading: false,
                        payload: response.data,
                        ...action
                    });
                }).catch(errorRecall => { 
                    next({
                        type: action.type,
                        status: ERROR,
                        isLoading: false
                    });
                    next({
                        type: SERVER_ERROR,
                        error: errorRecall
                    });
                });
            }).catch(errorRefresh => {
                next({
                    type: action.type,
                    status: ERROR,
                    isLoading: false
                });
                next({
                    type: SERVER_ERROR,
                    error: errorRefresh
                });
            });
        } else {
            next({
                type: SERVER_ERROR,
                error
            });
        }
    });
}

const refreshAndRecall = () => {
    return new Promise((resolve, reject) => {
        const tokenInfo = getAuthToken();

        if (tokenInfo.token && tokenInfo.refreshToken) {
            const axiosConfig = {
                baseURL: AUTH_BASE_URL,
                method: "post",
                url: "/api/v1/identity/refresh",
                headers: { 
                    "Content-Type": "application/json",
                },
                data: {
                    token: tokenInfo.token,
                    refreshToken: tokenInfo.refreshToken
                }
            }

            axios(axiosConfig).then(response => {
                setLoginData(response.data.token, response.data.refreshToken, getUser());
                resolve();
            }).catch(error => { 
                if (error.response && error.response.data && error.response.data.errors 
                    && error.response.data.errors.length > 0 
                    && error.response.data.errors[0].indexOf("has been used") > 0) {
                        resolve();
                        console.log("duplicated refresh token and recall");
                } else {
                    reject(error);
                }
            });
        } else {
            reject();
        }
    });
}

const addAuthInfoInHeader = headers => {
    if (isLogin()) {
        headers[AUTH_HEARDER] = `${BEARER_PREFIX}${getAuthToken().token}`;
    }
}

export default axiosMiddelware;