import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

class List extends Component {
    componentWillMount() {
        this.props.listActions.getMenus();
    }

    componentWillUpdate(nextProps, nextState) {
        const activeMenus = nextProps.listR.menus.filter(m => m.isActive);

        if (activeMenus.length > 0) {
            this.props.history.push(`/menu/${activeMenus[0].id}`);
        }
    }
    
    showIsActive = isActive => isActive ? "active" : "";

    renderOptions(options) {
        const { menus } = this.props.listR;

        return menus.map((m, i) => {
            return (
                <li className={`list-group-item list-group-item-action ${this.showIsActive(m.isActive)}`} 
                    key={m.id} onClick={e => this.props.selectedIdChanged(m.id)}>{m.name}</li>
            );
        });
    }

    render() {
        return (
            <ul className="list-group">
                {this.renderOptions(this.props.listR.menus)}
            </ul>
        );
    }
}

export default withRouter(List);