import React, { Component } from 'react';
import { Row, Col, Modal, Tag } from 'antd';

import './OrderDetail.css';
import { STATUS_COLORS } from './OrderList';
import { datetimeString2DateString } from '../../utilities/util';
import Order from './Order';
import Summary from './Summary';

const { confirm } = Modal;
const REJECT_CONFIRM = "確定拒絕接收此單";
const OK = "確定";
const CANCEL = "取消";

class OrderDetail extends Component {

    render() {
        const { row, items, accept, reject } = this.props;

        return (
            <div>
                <Row>
                    <span className="title">{row.consumerName}</span>
                    <span className="date">{datetimeString2DateString(row.submitDateTime)}</span>
                </Row>
                <Row>
                    <Col span={1}>
                        <Tag className="status" color={STATUS_COLORS[row.orderStatus]}>{row.orderStatus}</Tag>
                    </Col>
                    <RejectReason reason={row.rejectReason} />
                </Row>
                <Row>
                    <Col span={16} className="items">
                        <Order items={items} />
                    </Col>
                    <Col span={8}>
                        <Summary id={row.id} status={row.orderStatus} items={items} className="summary" accept={accept} reject={reject} />
                    </Col>
                </Row>
            </div>
        );
    }
}

const RejectReason = props => {
    if (props.reason) {
        return (
            <Col className="reason" span={22} offset={1}>
                <i className="fas fa-exclamation-circle"></i>
                <span>{props.reason}</span>
            </Col>
        );
    } else {
        return null;
    }
}

export default OrderDetail;