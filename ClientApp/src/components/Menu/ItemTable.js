
import React from 'react';
import EditableTable from '../Shared/EditableTable';
import { ITEM_COLUMNS } from './constant';

const DELETE_MODE = "BATCH_DELETE";

class ItemTable extends React.Component {
    render() {
        const { data, onSelectedChange, onSave, selectedRowKeys, categoryId } = this.props;
        
        return (
            <EditableTable deleteMode={DELETE_MODE} columns={ITEM_COLUMNS} data={data}
                onSelectedChange={onSelectedChange}
                onSave={onSave}
                selectedRowKeys={selectedRowKeys}
                categoryId={categoryId}/>
        );
    }
}



export default ItemTable;
          