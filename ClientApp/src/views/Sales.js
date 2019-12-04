import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

//import { actions } from './OrdersRedux';
import Form from '../components/Sales/Form';
import BaseView from './BaseView';

class Sales extends BaseView {
    componentWillMount() {
        if (!this.props.match.params.id || !this.props.location.state) {
            this.props.history.push("/orders");
        }
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
    }

    render() {
        const {  } = this.props;
        
        if (!this.props.match.params.id || !this.props.location.state) return null;

        return (
            <div className="container">
                <Form id={this.props.match.params.id} items={this.props.location.state.items} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { searchOrders } = state.orders;

    return {
        //searchOrders
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        //searchOrdersActions: bindActionCreators(actions.searchOrdersActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sales));