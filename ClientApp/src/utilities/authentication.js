const TOKEN = "token";
const REFRESH_TOKEN = "refreshToken";
const USER = "user";

export const isLogin = () => {
    return (sessionStorage.getItem(TOKEN)) ? true : false;
}

export const setLoginData = (token, refreshToken, user) => {
    sessionStorage.setItem(TOKEN, token);
    sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
    sessionStorage.setItem(USER, user);
}

export const getAuthToken = () => {
    return { token: sessionStorage.getItem(TOKEN), refreshToken: sessionStorage.getItem(REFRESH_TOKEN) };
}

export const getUser = () => {
    return sessionStorage.getItem(USER);
}

export const logout = () => {
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);
}