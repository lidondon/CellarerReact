import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//import { actions } from './OrdersRedux';
import Report from '../components/MonthlySumReport/Report';
import BaseView from './BaseView';

class MonthlySumReport extends BaseView {

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
    }

    render() {
        //const { searchOrders, searchOrdersActions } = this.props;
        
        return (
            <div className="container">
                <Report />
            </div>
        );
    }
}

function mapStateToProps(state) {
    //const { searchOrders } = state.orders;

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

export default connect(mapStateToProps, mapDispatchToProps)(MonthlySumReport);