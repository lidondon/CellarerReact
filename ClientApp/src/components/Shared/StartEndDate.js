import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const START_DATE = "開始日期";
const END_DATE = "結束日期";

class StartEndDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    
    render() {
        const { placeholder, startDate, endDate, onChange } = this.props;

        return (
            <RangePicker placeholder={placeholder} defaultValue={[startDate, endDate]} onChange={onChange} />
        );
    }
}

StartEndDate.defaultProps = {
    placeholder: [START_DATE, END_DATE],
    startDate: moment().subtract(1, "months"),
    endDate: moment()
}

export default StartEndDate;