import React, { Component } from 'react';
import { Row, Col, Modal } from 'antd';
import moment from 'moment';

import './SearchOrders.css';
import Loading from '../Shared/Loading';
import StartEndDate from '../Shared/StartEndDate';
import OrderList from './OrderList';
import Statuses, { UNLIMITED } from '../Shared/OrderStatus/Statuses';
import { isEmptyObject } from '../../utilities/util';

const DATE_STRING_FORMAT = "YYYY-MM-DD";
const RANGE = "起迄日期：";
const STATUS = "狀態：";
const RETAILERS = "訂購店家";

class SearchOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRange: [moment().subtract(7, "days"), moment()],
            currentStatus: null,
            filteredOrders: null
        };
    }

    componentWillMount() {
        this.getOrders();
    }

    componentWillUpdate(nextProps, nextState) {
        const { orders } = nextProps.searchOrdersR;
        let filteredOrders = orders;
        let filterChanged = false;

        if (this.state.currentStatus !== nextState.currentStatus) {
            filterChanged = true;
            filteredOrders = filteredOrders.filter(o => nextState.currentStatus ? o.orderStatus === nextState.currentStatus : true);
        }

        if (filterChanged || this.props.searchOrdersR.orders !== orders) this.setState({ filteredOrders });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.dateRange != prevState.dateRange || this.props.searchOrdersR.refreshOrders) {
            this.getOrders();
        }
    }

    getOrders = () => {
        const { searchOrdersActions } = this.props;
        const { dateRange } = this.state;
        const startDate = (dateRange[0]) ? dateRange[0].format(DATE_STRING_FORMAT) : "2000-01-01";
        const endDate = (dateRange[1]) ? dateRange[1].format(DATE_STRING_FORMAT) : "9999-12-31";

        searchOrdersActions.getOrders(startDate, endDate);
    }

    isChanged = () => {
        const { changes, errorRowSet } = this.props.searchOrdersR;
        
        return (!isEmptyObject(changes) &&
            ((changes.itemsToUpdate && changes.itemsToUpdate.length > 0) || (changes.itemIdsToDelete && changes.itemIdsToDelete.size > 0))) ||
            (errorRowSet && errorRowSet.size > 0);
    }

    filterStatusOnChange = e => {
        //this.props.searchOrdersActions.orderStatusFilterOnChange(e.target.value);
        this.setState({ currentStatus: (e.target.value === UNLIMITED) ? null : e.target.value });
    }

    rangeOnChange = (dates, dateStrings) => {
        this.setState({ dateRange: [ dates[0], dates[1] ] });
    }
    
    render() {
        const { searchOrdersR, searchOrdersActions } = this.props;
        const { isLoading, cellarers } = searchOrdersR;
        const { dateRange, filteredOrders } = this.state;

        return (
            <div className="box">
                {isLoading && <Loading />}
                <Filter dateRange={dateRange} cellarers={cellarers} rangeOnChange={this.rangeOnChange} statusOnChange={this.filterStatusOnChange} />
                <Row className="row-orders">
                    <Col span={20}>
                        <OrderList orders={filteredOrders} isChanged={this.isChanged()}
                            searchOrdersR={searchOrdersR} searchOrdersActions={searchOrdersActions}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

const Filter = props => {
    const { dateRange, statusOnChange, rangeOnChange } = props;

    return (
        <div>
            <Row className="filter">
                <span>{RANGE}</span><StartEndDate startDate={dateRange[0]} endDate={dateRange[1]} onChange={rangeOnChange} />
            </Row>
            <Row className="filter">
                <span>{STATUS}</span><Statuses onChange={statusOnChange} />
            </Row>
        </div>
    );
}

export default SearchOrders;