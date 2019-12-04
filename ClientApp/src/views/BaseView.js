import React, { Component } from 'react';
import { notification, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Store from '../redux/store';
import { clearServerError } from './BaseViewRedux'

const ERROR_OCCUR = "發生錯誤！";

class BaseView extends Component {

    componentWillUpdate(nextProps, nextState) {
        if (this.props.baseView && nextProps.baseView) {
            const { serverError } = nextProps.baseView;
            
            if (this.props.baseView.serverError != serverError && serverError) {
                this.showError(serverError);
                Store.dispatch(clearServerError());
            }
        }
    }

    showError = error => {
        notification.open({
            message: ERROR_OCCUR,
            description: error,
            icon: <Icon type="frown" style={{color: "red"}} />,
            duration: null,
            style: { background: "pink" }
        });
    }
}

// function mapStateToProps(state) {
//     return {
//         baseView: state.baseView
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return {};
// }

// export default connect(mapStateToProps, mapDispatchToProps)(BaseView);
export default BaseView;