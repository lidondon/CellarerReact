import React, { Component } from 'react';
import { Input, Row, Col, Button, Modal } from 'antd';

import './OneInput.css';

const CANCEL = "取消";
const OK = "確定";
const WARNING = "尚未填寫拒接單原因！";

const { TextArea } = Input;

class OneInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reason: null
        }
    }

    reasonOnChange = e => {
        this.setState({ reason: e.target.value });
    }

    onOk = () => {
        const { reason } = this.state;
        
        if (reason) {
            this.setState({ reason: null });
            this.props.onOk(reason);
        } else {
            Modal.warning({ title: WARNING });
        }
    }

    onCancel = () => {
        this.setState({ reason: null });
        this.props.onCancel();
    }

    render() {
        const { message } = this.props;
        const { reason } = this.state;
        
        return (
            // <div className="modal" width="50%" visible={visible} onCancel={onCancel} footer={null} >
            <div>
                <Row>
                    <i className="far fa-question-circle icon"></i>
                    <span className="message">{message}</span>
                </Row>
                <Row className="reason">
                    <TextArea row={2} onChange={this.reasonOnChange} value={reason} />
                </Row>
                <Row>
                    <Col offset={14}>
                        <Button onClick={this.onCancel}>{CANCEL}</Button>
                        <Button className="operation" type="danger" onClick={this.onOk}>{OK}</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default OneInput;