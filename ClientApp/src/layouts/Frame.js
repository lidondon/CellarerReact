import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Button } from 'antd';

import './Frame.css';
import { isLogin, logout } from '../utilities/authentication';
import Logo from '../static_files/logo.png';
import { getUser } from '../utilities/authentication';

const LOGIN = "登入";
const LOGOUT = "登出";
const HELLO = "哈囉";

class Frame extends Component {

    onLoginClick = e => {
        this.props.history.push("/login");
    }

    onLogoutClick = e => {
        logout();
        this.props.history.push("/");
    }

    getMenu = () => {
        return isLogin() ? <HaveLogin onLogout={this.onLogoutClick} isSelected={this.isSelected} /> : 
            <Row><Col offset={22}><Button onClick={this.onLoginClick}>{LOGIN}</Button></Col></Row>;
    }

    isSelected = (path, isBlur = false) => {
        if (isBlur) {
            return (this.props.location.pathname.indexOf(path) >= 0) ? "menu-item-selected" : "";
        } else {
            return (path === this.props.location.pathname) ? "menu-item-selected" : "";
        }
    }

    render () {
        return (
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <Col span={3}>
                        <Link className="navbar-brand" to="/">
                            <img src={Logo} style={{width: "100%", height: "auto"}} alt="liquorder" />
                        </Link>
                    </Col>
                    <Col span={21}>
                        {this.getMenu()}
                    </Col>
                </div>
            </nav>
        );
    }
}

const HaveLogin = props => {
    const { isSelected } = props;

    return (
        <Row>
            <Col span={16}>
                <div className="navbar-collapse collapse ">
                    <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item">
                            <Link className="nav-link text-dark" to="/menus">
                                <span className={`menu-item ${isSelected("/menu", true)}`}>酒單</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark" to="/orders">
                                <span className={`menu-item ${isSelected("/orders")}`}>訂單</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark" to="/monthlysumreport">
                                <span className={`menu-item ${isSelected("/monthlysumreport")}`}>報表</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Col>
            <Col span={8}>
                <span className="hello">{`${HELLO}，${getUser()}`}</span>
                <Button onClick={props.onLogout} className="login">{LOGOUT}</Button>
            </Col>
        </Row>
    );
}

export default withRouter(Frame);