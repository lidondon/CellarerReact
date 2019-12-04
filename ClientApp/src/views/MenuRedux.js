import { combineReducers } from 'redux';

import items from '../components/Menu/ItemsRedux';
import * as itemsActions from '../components/Menu/ItemsRedux';
import liquors from '../components/Menu/LiquorsRedux';
import * as liquorsActions from '../components/Menu/LiquorsRedux';

export const actions = {
    itemsActions,
    liquorsActions
}

export default combineReducers({
    items,
    liquors
});