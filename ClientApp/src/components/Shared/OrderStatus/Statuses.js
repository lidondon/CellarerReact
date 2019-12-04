import React, { Component } from 'react';

import TabRadioButtons from '../TabRadioButtons';

export const UNLIMITED = "UNLIMITED";

const StatusList = [
    { value: "UNLIMITED", text: "不限" },
    { value: "SUBMIT", text: "新訂單" },
    { value: "ACCEPT", text: "已接單" },
    { value: "REJECT", text: "駁回" }
];

class Statuses extends Component {
    render() {
        const { onChange } = this.props;

        return (
            <TabRadioButtons onChange={onChange} items={StatusList} defaultValue={UNLIMITED} />
        );
    }
}

export default Statuses;