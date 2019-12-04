export const isEmptyObject = obj => {
    return obj ? JSON.stringify(obj) === "{}" : true;
}

export const clearObject = obj => {
    for (const prop of Object.keys(obj)) {
        delete obj[prop];
    }
}

export const intIds2Strings = (objs, keyProps = ["id"]) => {
    objs.forEach(obj => keyProps.forEach(prop => {
        if (obj.hasOwnProperty(prop)) obj[prop] = String(obj[prop]);
    }));

    return objs
}

export const stringIds2Ints = (objs, keyProps = ["id"]) => {
    objs.forEach(obj => keyProps.forEach(prop => {
        if (obj.hasOwnProperty(prop)) obj[prop] = parseInt(obj[prop]);
    }));

    return objs
}

export const assembleErrorMsg = (prefix, error) => {
    let result = (error) ? `${prefix}: ${error.message}` : null;

    try {
        result = result ? `${result} => ${error.response.data.errors}` : result;
    } catch (error) {
    }

    return result;
}

export const datetimeString2DateString = s => {
    let result = "";
    let date = new Date(s);

    if (date) {
        const yyyy = date.getFullYear();
        const month = date.getMonth() + 1;
        const MM =  `${month > 9 ? "" : "0"}${month}`;
        const day = date.getDate();
        const dd =  `${day > 9 ? "" : "0"}${day}`;

        result = `${yyyy}-${MM}-${dd}`;
    }
    

    return result;
}
