import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { Modal } from 'antd';

import { isLogin } from '../utilities/authentication';
import BaseView from './BaseView';
import IconInput from '../components/Shared/IconInput';
import * as actions from './LoginRedux';

const USER_LOGIN = "用戶登入";
const INPUT_ACCOUNT_PASSWORD = "請輸入帳號密碼";

class Login extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            password: ""
        }
    }

    componentWillMount() {
        if (isLogin()) this.handleAlreadyLogin();
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        if (isLogin()) this.handleAlreadyLogin();
    }

    handleAlreadyLogin = e => {
        this.props.history.push("/");
    }

    handleAccountChanged = e => {
        this.setState({ account: e.target.value });
    }

    handlePasswordChanged = e => {
        this.setState({ password: e.target.value });
    }

    handleLogin = () => {
        const { actions } = this.props;
        const { account, password } = this.state;
        
        if (!account || !password) {
            Modal.warning({ title: INPUT_ACCOUNT_PASSWORD });
        } else {
            actions.login(this.state.account, this.state.password);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <LoginBlock handleAccountChanged={this.handleAccountChanged} 
                            handlePasswordChanged={this.handlePasswordChanged}
                            login={this.handleLogin}/>
                    </div>
                </div>
            </div>
            
        );
    }
}

const LoginBlock = props => {
    const { handleAccountChanged, handlePasswordChanged } = props;
    
    return (
        <div className="card">
            <article className="card-body">
                <h4 className="card-title text-center mb-4 mt-1">{USER_LOGIN}</h4>
                <hr />
                <IconInput icon="fa fa-user" placeHolder="Email or Account" type="email" onChange={handleAccountChanged} />
                <IconInput icon="fa fa-lock" placeHolder="******" type="password" onChange={handlePasswordChanged} />
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block" onClick={props.login}> Login  </button>
                </div>
            </article>
        </div>
    );
}



function mapStateToProps(state) {
    return {
        login: state.login,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));