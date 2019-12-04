import React, { Component } from 'react';
import { Descriptions, Row } from 'antd';

import './MetaData.css';

const { Item } = Descriptions;

const FORM = "銷貨單";
const SERIAL_NUMBER = "銷貨單號";
const DATE = "銷貨日期";
const CUSTOMER_NAME = "客戶名稱";
const SALES_MAN = "銷貨人員";
const TAX_ID_NUMBER = "統一編號";
const LIAISON = "聯絡電話";
const DESTINATION = "送貨地址";

class Metadata extends Component {

    render() {
        const { } = this.props;

        return (
            <div>
                <Row className="title">萱筠股份有限公司</Row>
                <Row className="address">100 台北市中正區精華路101號5樓</Row>
                <Row className="form">{FORM}</Row>
                <Descriptions  >
                    <Item label={SERIAL_NUMBER}><span>40618643728</span></Item>
                    <Item label={DATE}><span>108/11/12</span></Item>
                    <Item label={CUSTOMER_NAME}><span>40618643728</span></Item>
                    <Item label={SALES_MAN}><span>跑得快</span></Item>
                    <Item label={TAX_ID_NUMBER}><span>11002927362</span></Item>
                    <Item label={LIAISON}><span>02-29735327</span></Item>
                    <Item label={DESTINATION}><span>新北市三重區重新路31巷54號1樓</span></Item>
                </Descriptions>
            </div>
        );
    }
}


export default Metadata;