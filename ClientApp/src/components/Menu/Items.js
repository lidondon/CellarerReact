import React, { Component } from 'react';
import { Tabs, Row, Popconfirm, Modal } from 'antd';

import './Items.css';
import Loading from '../Shared/Loading';
import ItemTable from './ItemTable';
import Liquors from './Liquors';

import { isEmptyObject } from '../../utilities/util';

const NONE = "無";
const UPDATE_MENU_ERROR = "尚未填妥必填欄位";
const UPDATE_MENU_SUCCESS = "儲存成功";
const NOTHING_CHANGED = "菜單無任何異動";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const { TabPane } = Tabs;

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasLoadCategories: new Set(),
            selectedRowKeys: {},
            showModal: false
        }
    }

    componentWillMount() {
        this.props.itemsActions.getCategories(this.props.menuId);
    }

    componentWillUpdate(nextProps, nextState) {
        const { categories, updateMenuStatus, items } = nextProps.itemsR;

        if (this.state.hasLoadCategories.size === 0 && categories.length > 0) {
            this.props.itemsActions.getItems(this.props.menuId, categories[0].id, items[categories[0].id] && items[categories[0].id].length > 0);
            this.setState({ hasLoadCategories: this.state.hasLoadCategories.add(categories[0].id) });
        }

        if (this.props.itemsR.updateMenuStatus === LOADING && updateMenuStatus === SUCCESS) {
            this.updateMenuSuccess();
        }

        //for dubuging
        if (!nextProps.itemsR.errorRowSet) console.log("xxx");
    }

    updateMenuSuccess = () => {
        this.showUpdateMenuSuccess();
        this.setState({
            hasLoadCategories: new Set(),
            selectedRowKeys: {},
            showModal: false
        }, this.props.itemsActions.getCategories(this.props.menuId));
    }

    onCategorySelect = key => {
        const { items } = this.props.itemsR;
        const { hasLoadCategories } = this.state;

        if (!hasLoadCategories.has(key)) {
            this.props.itemsActions.getItems(this.props.menuId, key, items[key] && items[key].length > 0) ;
            this.setState({ hasLoadCategories: this.state.hasLoadCategories.add(key) });
        }
    }

    getTabPanes = (categories, items) => {
        let result = (
            <TabPane tab={NONE} key={-1}>
                <ItemTable data={[]} />
            </TabPane>
        );

        if (categories.length > 0) {
            result = categories.map(c => {
                return (
                    <TabPane tab={c.name} key={c.id}>
                        <ItemTable data={items[c.id]} categoryId={c.id}
                            selectedRowKeys={this.state.selectedRowKeys[c.id]}
                            onSelectedChange={this.onSelectedItemsChange}
                            onSave={this.handleSaveItem} />
                    </TabPane>
                );
            });
        }

        return result;
    }

    onSelectedItemsChange = (categoryId, keys) => {
        let selectedRowKeys = { ...this.state.selectedRowKeys };

        if (keys.length > 0) {
            selectedRowKeys[categoryId] = keys;
        } else {
            delete selectedRowKeys[categoryId];
        }
        this.setState({ selectedRowKeys });
    }

    handleSaveItem = (categoryId, row, error) => {
        this.props.itemsActions.saveItem(categoryId, row, error);
    };

    getIconBatchDeleteClass = () => {
        return (isEmptyObject(this.state.selectedRowKeys)) ? "disable" : "delete";
    }

    handleBatchDelete = () => {
        this.props.itemsActions.batchDelete(this.state.selectedRowKeys);
        this.setState({selectedRowKeys: {}});
    };

    showUpdateMenuErrorWarning = () => {
        Modal.warning({
            title: UPDATE_MENU_ERROR
        });
    }

    showUpdateMenuSuccess = () => {
        Modal.success({
            title: UPDATE_MENU_SUCCESS
        });
    }

    showNothingChangedWarning = () => {
        Modal.warning({
            title: NOTHING_CHANGED
        });
    }

    handleUpdateMenu = () => {
        const { menuId } = this.props;
        const { changes, errorRowSet } = this.props.itemsR;
        const { updateMenu } = this.props.itemsActions

        if (isEmptyObject(changes) || 
            ((!changes.itemsToUpdate || changes.itemsToUpdate.length === 0) && (!changes.itemIdsToDelete || changes.itemIdsToDelete.length === 0))) {
            this.showNothingChangedWarning();
        } else if (errorRowSet.size === 0) {
            this.props.itemsActions.updateMenu(menuId, changes)
        } else {
            this.showUpdateMenuErrorWarning();
        }
    }

    getOperationBtns = () => {
        const isDisabled = isEmptyObject(this.state.selectedRowKeys) ? true : false;

        return (
            <Row className="operations">
                <Popconfirm  disabled={isDisabled} title="確定刪除?" onConfirm={() => this.handleBatchDelete()}>
                    <a href="javascript: void(0)" className={this.getIconBatchDeleteClass()}><i className="fas fa-trash-alt " /></a>
                </Popconfirm>
                <a href="javascript: void(0)" onClick={this.handleShowModal} className="add"><i className="fas fa-cart-plus" /></a>
                <a href="javascript: void(0)" onClick={this.handleUpdateMenu} className="save"><i className="fas fa-save" /></a>
            </Row>
        );
    }

    handleShowModal = () => {
        this.setState({ showModal: true });
    }

    handleHideModal = () => {
        this.setState({ showModal: false });
    }

    handleAddItem = (addedCategories, addedItems) => {
        this.props.itemsActions.addItems(addedCategories, addedItems);
        this.setState({ showModal: false });
    }

    render() {
        const { isLoading, categories, items } = this.props.itemsR;
        const { showModal } = this.state;
        
        return (
            <div>
                {isLoading && <Loading />}
                <Tabs type="card" tabBarExtraContent={this.getOperationBtns()} onChange={this.onCategorySelect}>
                    {this.getTabPanes(categories, items)}
                </Tabs>
                <Modal width="50%" visible={showModal} onCancel={this.handleHideModal} footer={null}>
                    <Liquors liquorsR={this.props.liquorsR} liquorsActions={this.props.liquorsActions} 
                        onCancel={this.handleHideModal} onOk={this.handleAddItem}/>
                </Modal>
            </div>
        );
    }
}

export default Items;