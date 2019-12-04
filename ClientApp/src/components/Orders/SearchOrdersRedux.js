import { intIds2Strings, stringIds2Ints, pushNewObjectsNoDuplicate, replaceNewObject } from '../../utilities/util';

const GET_ORDERS = "GET_ORDERS";
const GET_ORDERS_URL = (startDate, endDate) => `/api/v1/cellarer/orders?startDate=${startDate}&endDate=${endDate}`;
const SEARCH_ORDERS_UPDATE_ORDER = "SEARCH_ORDERS_UPDATE_ORDER";
const SEARCH_ORDERS_UPDATE_ORDER_URL = id => `/api/v1/retailer/order/${id}/update`;
const GET_ORDER_ITEMS = "GET_ORDER_ITEMS";
const GET_ORDER_ITEMS_URL = id => `/api/v1/cellarer/order/${id}/items`;
const ACCEPT_ORDER = "ACCEPT_ORDER";
const ACCEPT_ORDER_URL = id => `/api/v1/cellarer/order/${id}/accept`;
const REJECT_ORDER = "REJECT_ORDER";
const REJECT_ORDER_URL = id => `/api/v1/cellarer/order/${id}/reject`;

const CLEAR_SEARCH_ORDERS = "CLEAR_SEARCH_ORDERS";
const CLEAR_ORDER_INFO = "CLEAR_ORDER_INFO";
//const ORDER_STATUS_FILTER_ON_CHANGE = "ORDER_STATUS_FILTER_ON_CHANGE";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const UNLIMITED = "UNLIMITED";
const INT_2_STRING_PROPS = ["id", "orderStatusId", "liquorId"];
const STRING_2_INT_PROPS = ["id", "orderStatusId", "quantity"];


const initialState = {
    isLoading: false,
    cellarers: [],
    orders: [],
    //showedOrders:[],
    orderItems: [],
    menuId: null,
    errorRowSet: new Set(),
    changes: {},
    updateOrderStatus: null,
    refreshOrders: false
}

export const clear = () => {
    return {
        type: CLEAR_SEARCH_ORDERS
    };
}

export const clearOrderInfo = () => {
    return {
        type: CLEAR_ORDER_INFO
    };
}

export const getOrders = (startDate, endDate) => {
    return {
        type: GET_ORDERS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_ORDERS_URL(startDate, endDate),
    };
}


export const updateOrder = (id, changes) => {
    return {
        type: SEARCH_ORDERS_UPDATE_ORDER,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: SEARCH_ORDERS_UPDATE_ORDER_URL(id),
        method: "post",
        params: converstringIds2Ints(changes)
    };
}

const converstringIds2Ints = changes => {
    if (changes.itemsToUpdate) {
        stringIds2Ints(changes.itemsToUpdate, INT_2_STRING_PROPS);
    }

    if (changes.itemIdsToDelete) {
        changes.itemIdsToDelete = Array.from(changes.itemIdsToDelete).map(d => parseInt(d));
    }

    return {...changes}
}

export const getOrderItems = id => {
    return {
        type: GET_ORDER_ITEMS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_ORDER_ITEMS_URL(id)
    };
}

export const acceptOrder = id => {
    return {
        type: ACCEPT_ORDER,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: ACCEPT_ORDER_URL(id),
        method: "post"
    };
}

export const rejectOrder = id => {
    return {
        type: REJECT_ORDER,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: REJECT_ORDER_URL(id),
        method: "post"
    };
}

// export const orderStatusFilterOnChange = status => {
//     return {
//         type: ORDER_STATUS_FILTER_ON_CHANGE,
//         status
//     };
// }

const reducer = (state = initialState, action) => {
    let resultCase = {
        CLEAR_SEARCH_ORDERS: processClear,
        GET_ORDERS: processGetOrders,
        CLEAR_ORDER_INFO: processClearOrderInfo,
        SEARCH_ORDERS_UPDATE_ORDER: processUpdateOrder,
        GET_ORDER_ITEMS: processGetOrderItems,
        ACCEPT_ORDER: processAcceptOrders,
        REJECT_ORDER: processRejectOrders,
        //ORDER_STATUS_FILTER_ON_CHANGE: processOrderStatusFilterOnChange
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processClear = (state, action) => {
    return {
        isLoading: false,
        orders: []
    };
}

const processClearOrderInfo = (state, action) => {
    return { ...state, orderItems: [], menuId: null, errorRowSet: new Set(), changes: {} };
}

const processGetOrders = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    result.refreshOrders = false;
    if (action.status === SUCCESS && action.payload) {
        result.orders = intIds2Strings(action.payload, INT_2_STRING_PROPS);
    }

    return result;
}

const getIemsFromMenuItems = menuItems => {
    return menuItems.map(m => {
        let item = Object.assign({}, m);

        item.id = "0";
        item.key = `${item.id}_${item.liquorId}`;
        item.menuItemDesc = m.itemDesc;
        delete item.itemDesc;

        return item;
    });
}

const processUpdateOrder = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result = { ...result, orderItems: [], menuId: null, errorRowSet: new Set(), changes: {} };
    }
    result.updateOrderStatus = action.status;
    
    return result;
}

const processGetOrderItems = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result.orderItems = intIds2Strings(action.payload, INT_2_STRING_PROPS);
    }
    
    return result;
}

const processAcceptOrders = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result.refreshOrders = true;
    }

    return result;
}

const processRejectOrders = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result.refreshOrders = true;
    }

    return result;
}

// const processOrderStatusFilterOnChange = (state, action) => {
//     return {
//         ...state,
//         showedOrders: action.status === UNLIMITED ? state.orders : state.orders.filter(o => o.orderStatus === action.status)
//     };
// }

const getBaseAxiosResult = (state, action) => {
    return {
        ...state,
        isLoading: action.isLoading,
        error: action.error
    };
}

export default reducer;