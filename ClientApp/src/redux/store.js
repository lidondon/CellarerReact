import { createStore, applyMiddleware } from 'redux';

import AxiosMiddleware from '../middlewares/AxiosMiddleware';
import reducers from '../redux/rootReducers';

export default createStore(reducers, applyMiddleware(AxiosMiddleware));