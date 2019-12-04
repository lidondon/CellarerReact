import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';


import './Liquors.css';
import Dropdown from '../Shared/Dropdown';
import Loading from '../Shared/Loading';
import { LIQUOR_COLUMNS } from './constant';

const CANCEL = "取消";
const OK = "加入";
const SELECTIOIN_WIDTH = 50;

class Liquors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasLoadCategories: new Set(),
            selectedRowKeys: {},
            selectedCategory: null
        }
    }

    componentWillMount() {
        this.props.liquorsActions.getLiquorCategories();
    }

    componentWillUpdate(nextProps, nextState) {
        /* because this dropdown doesn't have default selected item */
        const categories = nextProps.liquorsR.categories;
        
        if (this.state.hasLoadCategories.size === 0 && categories.length > 0) {
            this.props.liquorsActions.getLiquors(categories[0].id);
            this.setState({ 
                selectedCategory: categories[0].id,
                hasLoadCategories: this.state.hasLoadCategories.add(categories[0].id) 
            });
        }
    }

    getCategoryItems = (categories) => {
        return categories.map(c => ({key: c.id, text: c.name}));
    }

    onCategorySelecte = key => {
        const { hasLoadCategories } = this.state;
        let state = { selectedCategory: key };

        if (!hasLoadCategories.has(key)) {
            state.hasLoadCategories = hasLoadCategories.add(key);
            this.props.liquorsActions.getLiquors(key);
        }
        this.setState(state);
    }

    onLiquorSelectedChange = keys => {
        let selectedRowKeys = { ...this.state.selectedRowKeys };
        let categoryId = this.state.selectedCategory;

        if (keys.length > 0) {
            selectedRowKeys[categoryId] = keys;
        } else {
            delete selectedRowKeys[categoryId];
        }
        this.setState({  selectedRowKeys });
    }

    getRowSelection = () => {
        const { selectedRowKeys, selectedCategory } = this.state;

        return { 
            selectedRowKeys: selectedRowKeys[selectedCategory], 
            onChange: this.onLiquorSelectedChange
        };
    }

    getNewCategories = () => {
        const { categories } = this.props.liquorsR;
        const { selectedRowKeys } = this.state;
        let result = [];
        
        for (let k in selectedRowKeys) {
            result.push(categories.filter(c => c.id == k)[0]);
        }

        return result;
    }

    getSelectedLiquors = () => {
        const selectedRowKeys = { ...this.state.selectedRowKeys };
        const { liquors } = this.props.liquorsR;
        let result = {};

        for (let k in selectedRowKeys) {
            result[k] = liquors[k].filter(l => selectedRowKeys[k].includes(l.id));
        }
        
        return result;
    }

    onOk = e => {
        this.props.onOk(this.getNewCategories(), this.getSelectedLiquors());
        this.setState({ selectedCategory: null, selectedRowKeys: {} });
    }
    
    render() {
        const { isLoading, categories, liquors } = this.props.liquorsR;
        const { selectedCategory } = this.state;
        const { onCancel } = this.props;

        return (
            <div>
                {isLoading && <Loading />}
                <Row>
                    種類：<Dropdown selectedKey={selectedCategory} items={this.getCategoryItems(categories)} onSelect={this.onCategorySelecte} /> 
                </Row>
                <Row style={{marginTop: 10}}>
                    <Table bordered columns={LIQUOR_COLUMNS} dataSource={liquors[selectedCategory]} 
                        rowKey="id" rowSelection={this.getRowSelection()} /> 
                </Row>
                <Row className="row-confirm">
                    <Col span={3} offset={18} >
                        <button type="button" className="btn btn-outline-secondary btn-confirm" onClick={onCancel}>{CANCEL}</button>
                    </Col>
                    <Col span={3}>
                        <button type="button" className="btn btn-primary btn-confirm" onClick={this.onOk}>{OK}</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Liquors;