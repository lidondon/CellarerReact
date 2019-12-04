import { combineReducers } from 'redux';

import searchOrders from '../components/Orders/SearchOrdersRedux';
import * as searchOrdersActions from '../components/Orders/SearchOrdersRedux';

export const actions = {
    searchOrdersActions
}

export default combineReducers({
    searchOrders
});