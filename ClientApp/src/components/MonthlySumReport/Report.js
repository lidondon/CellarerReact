import React, { Component } from 'react';
import { Row, Col, InputNumber, Icon, Button, Collapse } from 'antd';
import moment from 'moment';

import './Report.css';
import Loading from '../Shared/Loading';
import Order from '../Orders/Order';
import TabRadioButtons from '../Shared/TabRadioButtons';
import { RETAILERS, MONTHLY_SUMMARYS } from './FakeData';

const YEAR = "年份：";
const RETAILERS_TEXT = "訂購店家：";
const UNLIMITED = "不限";
const TOTAL = "總計";

const { Panel } = Collapse;

const panelStyle = {
    background: '#fafafa',
    borderRadius: 4,
    marginBottom: 16,
    border: 0
};

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //dateRange: [moment().subtract(1, "months"), moment()]
        };
    }

    componentWillMount() {
        // const { searchOrdersActions } = this.props;
        // const { dateRange } = this.state;
        // const startDate = dateRange[0].format(DATE_STRING_FORMAT);
        // const endDate = dateRange[1].format(DATE_STRING_FORMAT);

        // searchOrdersActions.getOrders(startDate, endDate);
    }

    componentWillUpdate(nextProps, nextState) {
        // const { searchOrdersActions } = this.props;
        

        // if (this.state.dateRange != nextState.dateRange) {
        //     searchOrdersActions.getOrders();
        // }
    }

    getPanels = () => {
        return MONTHLY_SUMMARYS.map(m => {
            return (
                <Panel header={m.month} key={m.month} style={panelStyle} >
                    <Order items={m.summarys} pagination={false} showSum={true} />
                    <Row>
                        <Col offset={1} span={15} className="item-name">{TOTAL}</Col>
                        <Col span={8} className="total-amount">
                            <i className="fas fa-dollar-sign" />{m.total}
                        </Col>
                    </Row>
                </Panel>
            );
        });
    }
    
    render() {
        //const { searchOrdersR, searchOrdersActions, menuR, menuActions } = this.props;
        //const { isLoading, cellarers, orders } = searchOrdersR;
        //const { dateRange } = this.state;

        return (
            <div className="box">
                {/* {isLoading && <Loading />} */}
                <Filter retailers={RETAILERS}/>
                <Collapse className="summaries"
                    bordered={false}
                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />} >
                    {this.getPanels()}
                </Collapse>
            </div>
        );
    }
}

const Filter = props => {
    const { retailers } = props;
    const thisYear = moment().year();
    let items = retailers ? retailers.map(c => ({ value: c.id, text: c.name })) : [];

    items.splice(0, 0, { value: "0", text: UNLIMITED })

    return (
        <div>
            <Row className="filter">
                <span>{YEAR}</span>
                <InputNumber className="year-picker" prefix={<Icon type="calendar" />} 
                    defaultValue={thisYear} min={2010} max={thisYear} />
                <Button className="search" type="primary"><i className="fas fa-search"></i></Button>
            </Row>
            <Row className="filter">
                <span>{RETAILERS_TEXT}</span><TabRadioButtons items={items} defaultValue="0" />
            </Row>
        </div>
    );
}

export default Report;