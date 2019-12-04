import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from 'antd';

//import { isLogin } from '../../utilities/authentication';
import BaseView from '../BaseView';
import IconInput from '../../components/Shared/IconInput';
import Dropdown from '../../components/Shared/Dropdown';
import * as actions from './RegisterRedux';
import Loading from '../../components/Shared/Loading';

const USER_REGISTER = "註冊帳號";
const REGIStER = "註冊";
const NOT_COMPLETE = "尚未填妥所有欄位";
const CONFIRM_ERROR = "密碼確認錯誤";
const REGISTER_SUCCESS = "註冊新帳號成功";
const TYPES = [
    { text: "酒商", key: "CELLARER" },
    { text: "酒吧", key: "RETAILER" }
];

class Register extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            password: "",
            confirm: "",
            type: "CELLARER",
            serialNo: ""
        }
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        if (this.props.register.isLoading && !nextProps.register.isLoading && !nextProps.register.error) {
            this.registerSuccess();
        }
    }

    registerSuccess = () => {
        this.setState({
            account: "",
            password: "",
            confirm: "",
            type: "CELLARER",
            serialNo: ""
        });
        Modal.success({
            title: REGISTER_SUCCESS
        });
    }

    handleAlreadyLogin = e => {
        this.props.history.push("/");
    }

    onAccountChange = e => {
        this.setState({ account: e.target.value });
    }

    onPasswordChange = e => {
        this.setState({ password: e.target.value });
    }

    onConfirmChange = e => {
        this.setState({ confirm: e.target.value });
    }

    onTypeSelected = key => {
        this.setState({ type: key });
    }

    onSerialNoChange = e => {
        this.setState({ serialNo: e.target.value });
    }

    onRegister = () => {
        const { account, password, type, serialNo } = this.state;
        
        if (this.checkInput()) {
            this.props.actions.register(account, password, type, serialNo);
        }
    }

    checkInput = () => {
        let result = false;
        const { account, password, confirm, serialNo } = this.state;

        if (!account || !password || !confirm || !serialNo) {
            Modal.warning({
                title: NOT_COMPLETE
            });
        } else if (password !== confirm) {
            Modal.warning({
                title: CONFIRM_ERROR
            })
        } else {
            result = true;
        }

        return result;
    }

    render() {
        const { account, password, confirm, type, serialNo } = this.state;

        return (
            <div className="container">
                { this.props.register.isLoading && <Loading /> }
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <RegisterBlock
                            account={account} password={password}
                            confirm={confirm} type={type} serialNo={serialNo}
                            onAccountChange={this.onAccountChange} 
                            onPasswordChange={this.onPasswordChange}
                            onConfirmChange={this.onConfirmChange}
                            onTypeSelected={this.onTypeSelected}
                            onSerialNoChange={this.onSerialNoChange}
                            onRegister={this.onRegister} />
                    </div>
                </div>
            </div>
            
        );
    }
}

const RegisterBlock = props => {
    const { 
        account, password, confirm, type, serialNo,
        onAccountChange, onPasswordChange, onConfirmChange, onTypeSelected, onSerialNoChange, 
        onRegister
    } = props;
    
    

    return (
        <div className="card">
            <article className="card-body">
                <h4 className="card-title text-center mb-4 mt-1">{USER_REGISTER}</h4>
                <hr />
                <form>
                    <IconInput icon="fa fa-user" value={account} placeHolder="Email or Account" type="email" onChange={onAccountChange} />
                    <IconInput icon="fa fa-lock" value={password} placeHolder="******" type="password" onChange={onPasswordChange} />
                    <IconInput icon="far fa-check-circle" value={confirm} placeHolder="******" type="password" onChange={onConfirmChange} />
                    <IconInput icon="far fa-id-card" value={serialNo} placeHolder="SerialNo" onChange={onSerialNoChange} />
                    <Dropdown selectedKey={type} items={TYPES} onSelect={onTypeSelected} />
                    <div className="form-group" style={{marginTop: "1rem"}}>
                        <button type="submit" className="btn btn-primary btn-block" onClick={onRegister}>{REGIStER}</button>
                    </div>
                </form>
            </article>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        register: state.register,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);