import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import 'antd/dist/antd.css';
import AxiosMiddleware from './middlewares/AxiosMiddleware';
import reducers from './redux/rootReducers';
import Frame from './layouts/Frame';
import Home from './views/Home';
import Login from './views/Login';
import Menus from './views/Menus';
import Menu from './views/Menu';
import Orders from './views/Orders';
import Sales from './views/Sales';
import MonthlySumReport from './views/MonthlySumReport';
import Register from './views/backdoor/Register';
import { isLogin } from './utilities/authentication';
import Store from './redux/store';

class App extends React.Component {
    render () {
        return (
            <HashRouter>
                <div>
                    <Frame />
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" component={Login}/>
                    <PrivateRoute exact path="/menus" component={Menus} />
                    <PrivateRoute exact path="/menu/:id" component={Menu}/>
                    <PrivateRoute exact path="/orders" component={Orders}/>
                    <PrivateRoute exact path="/sales/:id" component={Sales}/>
                    <PrivateRoute exact path="/monthlysumreport" component={MonthlySumReport}/>
                </div>
            </HashRouter>
        );
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => isLogin()  ? <Component {...props} /> : <Redirect to='/login' />} />
)

render(
    <Provider store={Store}>
        <App />
    </Provider>
, document.getElementById('app'));