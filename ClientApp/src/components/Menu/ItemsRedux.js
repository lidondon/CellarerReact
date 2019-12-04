import { intIds2Strings, stringIds2Ints, clearObject } from '../../utilities/util';

const CLEAR_ITEMS = "CLEAR_ITEMS";
const GET_CATEGORIES = "GET_CATEGORIES";
const GET_CATEGORIES_URL = id => `/api/v1/cellarer/menu/${id}/categories`;
const GET_ITEMS = "GET_ITEMS";
const GET_ITEMS_URL = (id, categoryId) => `/api/v1/cellarer/menu/${id}/items?categoryId=${categoryId}`;
const SAVE_ITEM = "SAVE_ITEM";
const UPDATE_MENU = "UPDATE_MENU";
const UPDATE_MENU_URL = id => `/api/v1/cellarer/menu/${id}/update`;

const BATCH_DELETE = "BATCH_DELETE";
const ADD_ITEMS = "ADD_ITEMS";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const INT_2_STRING_PROPS = ["id", "liquorId", "menuId", "unitId", "price"];


const initialState = {
    isLoading: false,
    error: "",
    categories: [],
    items: {},
    changes: {},
    updateMenuStatus: null,
    errorRowSet: new Set()
}

export const clear = () => {
    return {
        type: CLEAR_ITEMS
    };
}

export const getCategories = id => {
    return {
        type: GET_CATEGORIES,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_CATEGORIES_URL(id)
    };
}

export const getItems = (id, categoryId, isWithNewItems) => {
    return {
        type: GET_ITEMS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_ITEMS_URL(id, categoryId),
        categoryId,
        isWithNewItems
    };
}

export const saveItem = (categoryId, row, error) => {
    return {
        type: SAVE_ITEM,
        categoryId,
        row, 
        error
    };
}

export const addItems = (addedCategories, addedItems) => {
    return {
        type: ADD_ITEMS,
        addedCategories,
        addedItems
    }
}

export const batchDelete = (selectedRowKeys) => {
    return {
        type: BATCH_DELETE,
        selectedRowKeys
    }
}

export const updateMenu = (id, changes) => {
    return {
        type: UPDATE_MENU,
        method: "post",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: UPDATE_MENU_URL(id),
        params: converstringIds2Ints(changes)
    };
}

const converstringIds2Ints = changes => {
    if (changes.itemsToUpdate) {
        stringIds2Ints(changes.itemsToUpdate, INT_2_STRING_PROPS);
    }

    if (changes.itemIdsToDelete) {
        changes.itemIdsToDelete = changes.itemIdsToDelete.map(d => parseInt(d));
    }

    return {...changes}
}

const reducer = (state = initialState, action) => {
    let resultCase = {
        GET_CATEGORIES: processGetCategories,
        GET_ITEMS: processGetItems,
        BATCH_DELETE: processBatchDelete,
        ADD_ITEMS: processAddItems,
        SAVE_ITEM: proscessSaveItem,
        UPDATE_MENU: processUpdateMenu,
        CLEAR_ITEMS: processClear
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processClear = (state, action) => {
    return {
        isLoading: false,
        error: "",
        categories: [],
        items: {},
        changes: {},
        updateMenuStatus: null,
        errorRowSet: new Set()
    };
}

const processGetCategories = (state, action) => {
    let result = getBaseAxiosResult(state, action);

    if (action.status == SUCCESS && action.payload) result.categories = intIds2Strings(action.payload);

    return result;
}

const processGetItems = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    let { errorRowSet } = state;
    
    if (action.status == SUCCESS && action.payload) {
        let theItmes = generateItemRowKeys(action.payload);

        if (action.isWithNewItems) {
            result.items[action.categoryId].forEach(newItem => {
                if (theItmes.filter(old => old.liquorId === newItem.liquorId).length === 0) {
                    theItmes.push(newItem);
                } else {
                    errorRowSet.delete(newItem.key);
                }
            });
        }
        result.items[action.categoryId] = theItmes;
    }
    
    return result;
}

const generateItemRowKeys = rows => {
    intIds2Strings(rows, INT_2_STRING_PROPS);

    return rows.map(r => {
        r.key = `${r.id}_${r.liquorId}`;

        return r;
    });
}

const getIemsFromLiquors = liquors => {
    return liquors.map(l => {
        let item = Object.assign({}, l);
        item.liquorId = l.id;
        item.id = "0";
        item.key = `${item.id}_${item.liquorId}`;
        item.liquorName = l.name;
        item.liquorNameEn = l.nameEn;
        item.liquorBottling = l.bottling;
        item.liquorCapacity = l.capacity;
        item.unitId = "0";
        deleteUnnecessaryProps(item);

        return item;
    });
}

const deleteUnnecessaryProps = (item) => {
    delete item.bottling;
    delete item.brandId;
    delete item.capacity;
    delete item.categoryId;
    delete item.bottling;
    delete item.name;
    delete item.updatedAt;
    delete item.isAvailable;
}

const processAddItems = (state, action) => {
    let { addedCategories, addedItems } = action;
    let { items, categories } = state;

    for (let k in addedItems) {
        let newItems = getIemsFromLiquors(addedItems[k]);

        if (items[k]) {
            pushNewItemsNoDuplicate(items[k], newItems);
        } else {
            if (categories.filter(c => c.id === k).length == 0) {
                categories.push(addedCategories.filter(c => c.id == k)[0]);
            }
            items[k] = newItems;
        }
    }

    return { ...state, items, categories };
}

const pushNewItemsNoDuplicate = (oldItems, newItems) => {
    newItems.forEach(n => {
        if (!oldItems.find(i => i.liquorId == n.liquorId)) oldItems.push(n);
    });
}

const processBatchDelete = (state, action) => {
    let { items, changes, categories, errorRowSet } = state;
    let { selectedRowKeys } = action;
    let updates = changes.itemsToUpdate;
    
    deleteFromErrorRowSet(errorRowSet, selectedRowKeys);
    for (let k in selectedRowKeys) {
        let orgDelete = (changes.itemIdsToDelete) ? changes.itemIdsToDelete : [];
        let deletedIds = getIdsFromItemKeys(selectedRowKeys[k]);

        orgDelete.push(...deletedIds.ids);
        changes.itemIdsToDelete = orgDelete;
        updates = deleteFromUpdates(updates, deletedIds);
        items[k] = items[k].filter(i => !selectedRowKeys[k].includes(i.key));
        //delete empty categories
        if (items[k].length == 0) categories = categories.filter(c => c.id != k);
    }
    changes.itemsToUpdate = updates;

    return { ...state, items, changes, categories, errorRowSet };
}

const deleteFromErrorRowSet = (errorRowSet, selectedRowKeys) => {
    for (let k in selectedRowKeys) {
        selectedRowKeys[k].forEach(id => errorRowSet.delete(id));
        if (errorRowSet.size === 0) break;
    }
}

const deleteFromUpdates = (updates, deletedIds) => {
    return !updates ? updates : updates.filter(u => {
        if (u.id !== "0") {
            return !deletedIds.ids.includes(u.id); 
        } else {
            return !deletedIds.liquorIds.includes(u.liquorId); 
        }
    });
}

const getIdsFromItemKeys = keys => {
    let result = { ids: [], liquorIds: [] };

    keys.forEach(k => {
        let ids = k.split("_");
        if (ids[0] !== "0") {
            result.ids.push(ids[0]);
        } else {
            result.liquorIds.push(ids[1]);
        }
    });

    return result;
}

const proscessSaveItem = (state, action) => {
    const { items, changes, errorRowSet } = state;
    const { categoryId, row, error } = action;
    
    if(error) {
        errorRowSet.add(row.key);
    } else {
        let newDatas = items[categoryId];
        const index = newDatas.findIndex(data => row.key == data.key);
        const orgRow = newDatas[index];
        const newRow = { ...orgRow, ...row };

        newDatas.splice(index, 1, newRow);
        changes.itemsToUpdate = addItem2Updates(changes.itemsToUpdate, newRow);
        errorRowSet.delete(row.key);
    }
    
    return { ...state, items, changes, errorRowSet };
}

const addItem2Updates = (updates, row) => {
    updates = (updates) ? updates : [];
    let index = updates.findIndex(u => {
        if (u.id && u.id !== "0") {
            return u.id == row.id;
        } else {
            return u.liquorId == row.liquorId;
        }
    });

    if (index >= 0) {
        let orgRow = updates[index];

        updates.splice(index, 1, {...orgRow, ...row});
    } else {
        updates.push(row);
    }

    return updates;
}

const processUpdateMenu = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result.categories.length = 0;
        clearObject(result.items);
        clearObject(result.changes);
    }
    result.updateMenuStatus = action.status;
    console.log("update")
    return result;
}


const getBaseAxiosResult = (state, action) => {
    return {
        ...state,
        isLoading: action.isLoading,
        error: action.error
    };
}

export default reducer;