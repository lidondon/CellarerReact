import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon } from 'antd';

const DEAFULT = "";

class DropdownList extends Component {

    getText = () => {
        const { selectedKey } = this.props;
        let result = DEAFULT;

        if (selectedKey) {
            result = this.props.items.filter(i => i.key == selectedKey)[0].text;
        } else {
            result = (this.props.text) ? this.props.text : result;
        }
        
        return result;
    }

    onClick = e => {
        this.props.onSelect(e.key);
    }

    getItems = (items) => {
        return (
            <Menu onClick={this.onClick} >
                {(items.length > 0) && items.map(item => {
                    return (
                        <Menu.Item key={item.key}>
                            {(item.icon) ? <Icon type={item.icon}/> : null}
                            {item.text}
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    }

    render() {
        const { items } = this.props;

        return (
            <Dropdown overlay={this.getItems(items)}>
                <Button>
                    {this.getText()} <Icon type="down" />
                </Button>
            </Dropdown> 
        );
    }
}



export default DropdownList;