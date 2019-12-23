import React, { Component } from 'react';
import { Radio } from 'antd';

const { Group, Button } = Radio;

class TabRadioButtons extends Component {

    getItems = (items) => {
        return (items) ? items.map(i => <Button value={i.value} key={i.value}><span>{i.text}</span></Button>) : null;
    }

    render() {
        const { items, onChange, defaultValue, value } = this.props;

        return (
            <Group defaultValue={defaultValue} onChange={onChange} value={value}>
                {this.getItems(items)}
            </Group>
        );
    }
}

export default TabRadioButtons;