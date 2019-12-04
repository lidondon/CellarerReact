import { combineReducers } from 'redux';

import list from '../components/Menus/ListRedux';
import * as listActions from '../components/Menus/ListRedux';

export const actions = {
    listActions
}

export default combineReducers({
    list
});