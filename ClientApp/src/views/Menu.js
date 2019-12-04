import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Prompt } from "react-router-dom";

import { isEmptyObject } from '../utilities/util';
import Items from '../components/Menu/Items';
import BaseView from './BaseView';
import { actions } from './MenuRedux';

class Menu extends BaseView {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
        this.props.itemsActions.clear();
        this.props.liquorsActions.clear();
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
    }

    isChanged = () => {
        const { changes } = this.props.items; 
        const { itemsToUpdate, itemIdsToDelete } = changes;

        return !isEmptyObject(changes) &&
            (!isEmptyObject(itemsToUpdate) || (!isEmptyObject(itemIdsToDelete) && itemIdsToDelete.length > 0));
    }

    render() {
        const { items, liquors, itemsActions, liquorsActions } = this.props; 
        
        return (
            <div className="container">
                <Prompt when={this.isChanged()} message={location => "尚未存擋，確定要離開？"} />
                <Items menuId={this.props.match.params.id}
                    itemsR={items}
                    itemsActions={itemsActions}
                    liquorsR={liquors}
                    liquorsActions={liquorsActions}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.menu.items,
        liquors: state.menu.liquors,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        itemsActions: bindActionCreators(actions.itemsActions, dispatch),
        liquorsActions: bindActionCreators(actions.liquorsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Menu));