import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import List from '../components/Menus/List';
import BaseView from './BaseView';
import { actions } from './MenusRedux';

class Menus extends BaseView {
    // componentDidMount() {
    //     this.props.history.push("/menu/7");
    // }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
    }

    handleEditBtnClick = e => {
        //this.props.history.push(`/menu/${this.props.list.selectedId}`);
    }

    render() {
        const { list, listActions } = this.props; 
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10" >
                        <List listR={list} listActions={listActions}/>
                    </div>
                    <div className="col-md-1" >
                        <button type="button" className="btn btn-success" onClick={this.handleEditBtnClick}>編輯</button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    //console.log("menus state", state);
    return {
        list: state.menus.list,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        listActions: bindActionCreators(actions.listActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Menus));