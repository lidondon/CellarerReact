import React, { Component } from 'react';
import { Row, Col, Input, Select } from 'antd';
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
const ORDER_NUMBER = "orderNumber";
const ORDER_NUMBER_TEXT = "訂單編號";
const CELLARER = "cellarer";
const CELLARER_TEXT = "酒商";

class SearchOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRange: [moment().subtract(7, "days"), moment()],
            currentStatus: null,
            filteredOrders: null,
            searchType: CELLARER,
            search: null
        };
    }

    componentWillMount() {
        this.getOrders();
    }

    componentWillUpdate(nextProps, nextState) {
        this.processRangeChanged(nextProps, nextState);
        this.processFilterChanged(nextProps, nextState);
    }

    processRangeChanged =  (nextProps, nextState) => {
        const { dateRange } = nextState;

        if (this.state.dateRange !== dateRange) {
            this.setState({
                currentStatus: null,
                searchType: CELLARER,
                search: null
            });
        }
    }

    processFilterChanged = (nextProps, nextState) => {
        const { orders } = nextProps.searchOrdersR;
        let filteredOrders = orders;
        let filterChanged = false;
        const { currentStatus, searchType, search } = nextState;

        if (this.state.currentStatus !== currentStatus
            || this.state.search !== search
            || (search && this.state.searchType != searchType)) {
            filterChanged = true;
            filteredOrders = filteredOrders.filter(o => {
                let result = false;

                result = currentStatus ? o.orderStatus === currentStatus : true;
                if (result) {
                    if (searchType === ORDER_NUMBER) {
                        result = search ? o.formNumber === search : true;
                    } else {
                        result = search ? o.consumerName.toLowerCase().indexOf(search.toLowerCase()) >= 0 : true;
                    }
                }

                return result;
            });
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
        this.setState({ currentStatus: (e.target.value === UNLIMITED) ? null : e.target.value });
    }

    rangeOnChange = (dates, dateStrings) => {
        this.setState({ dateRange: [ dates[0], dates[1] ] });
    }

    onSearchTypeChange = type => {
        this.setState({ searchType: type });
    }

    onSearchChange = e => {
        this.setState({ search: e.target.value });
    }
    
    render() {
        const { searchOrdersR, searchOrdersActions } = this.props;
        const { isLoading, cellarers } = searchOrdersR;
        const { dateRange, currentStatus, searchType, search, filteredOrders } = this.state;

        return (
            <div className="box">
                {isLoading && <Loading />}
                <Filter dateRange={dateRange} cellarers={cellarers} rangeOnChange={this.rangeOnChange} 
                    statusOnChange={this.filterStatusOnChange}
                    onSearchTypeChange={this.onSearchTypeChange} onSearchChange={this.onSearchChange}
                    currentStatus={currentStatus} searchType={searchType} search={search} />
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
    const { 
        currentStatus, searchType, search,
        dateRange, statusOnChange, rangeOnChange, onSearchTypeChange, onSearchChange 
    } = props;

    return (
        <div>
            <Row className="filter">
                <span>{RANGE}</span><StartEndDate startDate={dateRange[0]} endDate={dateRange[1]} onChange={rangeOnChange} />
            </Row>
            <Row className="filter">
                <span>{STATUS}</span><Statuses onChange={statusOnChange} value={currentStatus} />
            </Row>
            <Row className="filter">
                <OrderOrCellarer searchType={searchType} search={search}
                    onSearchTypeChange={onSearchTypeChange} onSearchChange={onSearchChange} />
            </Row>
        </div>
    );
}

const OrderOrCellarer = props => {
    const { searchType, search, onSearchTypeChange, onSearchChange } = props;

    return (
        <Input.Group compact>
            <Select className="search-type" defaultValue={CELLARER} onChange={onSearchTypeChange} value={searchType}>
                <Select.Option value={ORDER_NUMBER}>{ORDER_NUMBER_TEXT}</Select.Option>
                <Select.Option value={CELLARER}>{CELLARER_TEXT}</Select.Option>
            </Select>
            <Input style={{width: "200px"}} onChange={onSearchChange} value={search} />
        </Input.Group>
    );
}

export default SearchOrders;