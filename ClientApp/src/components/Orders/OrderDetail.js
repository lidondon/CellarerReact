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
                    <Tag className="status" color={STATUS_COLORS[row.orderStatus]}>{row.orderStatus}</Tag>
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

export default OrderDetail;