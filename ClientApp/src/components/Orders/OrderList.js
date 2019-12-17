import React, { Component } from 'react';
import { Table, Row, Col, Tag, Modal, Icon, Button } from 'antd';

import './OrderList.css';
//import { getDistinctField } from '../../utilities/util';
import OrderDetail from './OrderDetail';
import OneInput from '../Shared/ModalContents/OneInput';

export const STATUS_COLORS = {
    "SUBMIT": "green",
    "ACCEPT": "darkgreen",
    "REJECT": "tomato"
}

const PURCHASE = "訂購";
const CATEGORY = "分類：";
const OK = "確定" ;
const CANCEL = "取消";
const NOT_SAVE_YET = "尚未儲存，確定要離開？";
const UPDATE_ORDER_SUCCESS = "更新訂單成功";
const REJECT_CONFIRM = "確定拒絕接受此訂單";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const { confirm } = Modal;

const COLUMNS = [
    {
        title: "單號",
        dataIndex: "formNumber",
        width: "30%"
    },
    {
        title: "酒吧",
        dataIndex: "consumerName",
        width: "30%",
        sorter: (a, b) => a.consumerName.localeCompare(b.consumerName),
        sortDirections: ["ascend", "descend"]
    },
    {
        title: "狀態",
        dataIndex: "orderStatus",
        width: "15%",
        render: (text, record) => <Tag color={STATUS_COLORS[text]}>{text}</Tag>
    },
    {
        title: "送出時間",
        dataIndex: "submitDateTime",
        width: "25%",
        sorter: (a, b) => new Date(a.submitDateTime) - new Date(b.submitDateTime),
        sortDirections: ["ascend", "descend"]
    }
];

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: {},
            showModal: false,
            showRejectConfirm: false,
            selectedRowKeys: []
        };
    }

    componentWillUpdate(nextProps, nextState) {
    }

    // showUpdateOrderSuccess = () => {
    //     Modal.success({
    //         title: UPDATE_ORDER_SUCCESS
    //     });
    //     this.setState({ showModal: false });
    // }

    onRowClick = record => {
        const { getOrderItems } = this.props.searchOrdersActions;

        this.setState({ row: record, showModal: true });
        getOrderItems(parseInt(record.id));
    }

    onRow = record => {
        return {
            onClick: e => this.onRowClick(record)
        };
    }

    onCancelModal = () => {
        this.setState({ showModal: false });
        this.props.searchOrdersActions.clearOrderInfo();
    }

    accept = () => {
        const { row } = this.state;
        const { acceptOrder } = this.props.searchOrdersActions;
        
        acceptOrder(row.id);
        this.onCancelModal();
    }

    reject = () => {
        this.setState({ showRejectConfirm: true });
    }

    rejectConfirmOk = reason => {
        const { row } = this.state;
        const { rejectOrder } = this.props.searchOrdersActions;

        rejectOrder(row.id, reason);
        this.onCancelModal();
        this.setState({ showRejectConfirm: false });
    }

    rejectConfirmCancel = () => {
        this.setState({ showRejectConfirm: false });
    }

    getModalContent = () => {
        const { row } = this.state;

        return <OrderDetail row={row}
                items={this.props.searchOrdersR.orderItems}
                accept={this.accept} reject={this.reject} />
    }
    
    render() {
        //const {} = this.state;
        const { orders } = this.props;
        const { showModal, showRejectConfirm } = this.state;

        return (
            <div>
                <Table columns={COLUMNS} className="orderList"
                    dataSource={orders} rowKey="id" pagination={false} onRow={this.onRow} /> 
                <Modal width="80%" visible={showModal} onCancel={this.onCancelModal} footer={null} >
                    {this.getModalContent()}
                </Modal>
                <Modal width="400px" visible={showRejectConfirm} onCancel={this.onCancelModal} footer={null}
                    closable={false} maskClosable={false}>
                    <OneInput message={REJECT_CONFIRM} onOk={this.rejectConfirmOk} onCancel={this.rejectConfirmCancel}/>
                </Modal>
            </div>
        );
    }
}

export default OrderList;