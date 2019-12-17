export const ITEM_COLUMNS = [
    {
        title: "名稱",
        dataIndex: "liquorName",
        width: "20%"
    },
    {
        title: "容量",
        dataIndex: "liquorCapacity",
        width: "15%"
    },
    {
        title: "包裝",
        dataIndex: "liquorBottling",
        width: "15%"
    },
    {
        title: "金額",
        dataIndex: "price",
        width: "10%",
        editable: true,
        required: true,
        type: "integer"
    },
    {
        title: "描述",
        dataIndex: "itemDesc",
        width: "40%",
        editable: true
    }
];

export const LIQUOR_COLUMNS = [
    {
        title: "名稱",
        dataIndex: "name",
        width: "40%"
    },
    {
        title: "容量",
        dataIndex: "capacity",
        width: "30%"
    },
    {
        title: "包裝",
        dataIndex: "bottling",
        width: "30%"
    }
];