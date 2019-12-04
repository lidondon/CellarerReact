import React, { Component } from 'react';
import { Table } from 'antd';

const COLUMNS = [
    {
        title: "名稱",
        dataIndex: "liquorName",
        width: "25%"
    },
    {
        title: "容量",
        dataIndex: "liquorCapacity",
        width: "15%"
    },
    {
        title: "包裝",
        dataIndex: "liquorBottling",
        width: "20%"
    },
    {
        title: "金額",
        dataIndex: "price",
        width: "15%"
    },
    {
        title: "數量",
        dataIndex: "quantity",
        width: "15%"
    }
];

class Order extends Component {
    constructor(props) {
        super(props);
        this.columns = Object.assign([], COLUMNS); //不這樣copy的話，COLUMNS也會跟著被改變
        if (this.props.showSum) {
            this.columns.push({
                title: "小計",
                width: "10%",
                align: "right",
                render: (text, record) => <span>${record.quantity * record.price}</span>
            });
        }
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
    }

    render() {
        const { pagination, showHeader, items } = this.props;

        return <Table columns={this.columns} dataSource={items} rowKey="id" 
            showHeader={showHeader} pagination={pagination}/>;
    }
}

Order.defaultProps = {
    pagination: false,
    showSum: false,
    showHeader: true
}

export default Order;