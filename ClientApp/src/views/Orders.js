import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions } from './OrdersRedux';
import SearchOrders from '../components/Orders/SearchOrders';
import BaseView from './BaseView';

class Orders extends BaseView {

    componentWillUnmount() {
        this.props.searchOrdersActions.clear();
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
    }

    render() {
        const { searchOrders, searchOrdersActions } = this.props;
        
        return (
            <div className="container">
                <SearchOrders searchOrdersR={searchOrders} searchOrdersActions={searchOrdersActions} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { searchOrders } = state.orders;

    return {
        searchOrders,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        searchOrdersActions: bindActionCreators(actions.searchOrdersActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);