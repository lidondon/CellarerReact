import { combineReducers } from 'redux';

import menusReducers from '../views/MenusRedux';
import menuReducers from '../views/MenuRedux';
import loginReducers from '../views/LoginRedux';
import ordersReducers from '../views/OrdersRedux';
import registerReducers from '../views/backdoor/RegisterRedux';
import baseViewReducers from '../views/BaseViewRedux';

const reducers = {
    menus: menusReducers,
    menu: menuReducers,
    login: loginReducers,
    orders: ordersReducers,
    register: registerReducers,
    baseView: baseViewReducers
}

export default combineReducers(reducers);