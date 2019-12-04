import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Metadata from './Metadata';
import Order from '../Orders/Order';

class Form extends Component {
    render() {
        const { id, items } = this.props;

        return (
            <div>
                <Metadata />
                <Order items={items} showSum={true}/>
            </div>
        );
    }
}

export default Form;