import React from 'react';
import { Table, Input, Icon, Popconfirm, Form, Tag, Row, Col } from 'antd';

import { isEmptyObject } from '../../utilities/util';
import './EditableTable.css'

const BATCH_DELETE = "BATCH_DELETE";
const SINGLE_DELETE = "SINGLE_DELETE";

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            selectedRowKeys: [],
            change: {}
        };
    }

    componentDidMount() {
        //for solving directly operate browser ex: next page or previous page
        //if (isEmptyObject(this.state.change) ) this.setState({ dataSource: this.props.data });
    }

    componentDidUpdate(prevProps, prevState) {
        //if (prevProps.data !== this.props.data) this.setState({ dataSource: this.props.data });
    }

    processColumnsDelete(columns) {
        columns = columns.map(c => !(c.isImage) ? c : 
            {
                render: (text, record) => <img src="https://ibb.co/vDBbzCn" alt="image" crossOrigin="anonymous"/>
            }
        );

        if (this.props.deleteMode === SINGLE_DELETE) {
            columns.push({
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleSingleDelete(record.key)}>
                            <Icon type="delete" theme="twoTone" className="icon-delete" />
                        </Popconfirm>
                    ) : null
            });
        }

        return columns;
    }

    getColumns(columns) {
        let result = this.processColumnsDelete([...columns]);
        
        return result.map(col => {
            return (!col.editable) ? col :
                {
                    ...col,
                    onCell: record => ({
                        categoryId: this.props.categoryId,
                        record,
                        editable: col.editable,
                        type: col.type,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        required: col.required,
                        handleSave: this.props.onSave
                    })
                };
        });
    }

    handleSingleDelete = key => {
        const dataSource = [...this.state.dataSource];

        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };

    onSelectedChange = selectedRowKeys => {
        this.props.onSelectedChange(this.props.categoryId, selectedRowKeys);
    }

    render() {
        const { columns, deleteMode, data, selectedRowKeys } = this.props;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            }
        };
        const rowSelection = (deleteMode === BATCH_DELETE) ? { selectedRowKeys, onChange: this.onSelectedChange } : null;

        return (
            <div>
                <Table components={components} bordered
                    rowSelection={rowSelection}
                    rowClassName={() => 'editable-row'}
                    dataSource={data}
                    columns={this.getColumns(columns)} />
            </div>
        );
    }
}

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;

        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave, categoryId } = this.props;

        this.form.validateFields((error, values) => {
            if (!this.isTheSameValue(record, values)) handleSave(categoryId, { ...record, ...values }, error);
            if (error && error[e.currentTarget.id]) return;
            this.toggleEdit();
        });
    };

    isTheSameValue = (record, values) => {
        let result = true;

        for (let k in values) {
            if (!values[k] || record[k] !== values[k]) {
                result = false;
                break;
            }
        }

        return result;
    }

    validateInteger = (rule, value, callback) => {
        const { type } = this.props;

        if (value && type === "integer" && parseInt(value) != value) {
            callback("Integer only");
        } else {
            callback();
        }
    }

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, required } = this.props;
        const { editing } = this.state;

        return ((required && !children[2]) || editing) ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: "required",
                        },
                        {
                            validator: this.validateInteger,
                            message: "Integer only"
                        }
                    ],
                    initialValue: record[dataIndex],
                })(<Input autoFocus={required} className="input" ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
            ) 
            : 
            (
                <div className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit} >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            required,
            dataIndex,
            title,
            categoryId,
            record,
            index,
            handleSave,
            children,
            type,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}
            </td>
        );
    }
}

EditableCell.defaultProps = {
    required: false,
    type: "string"
}


export default EditableTable;
          