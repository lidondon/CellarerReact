import React, { Component } from 'react';
import { Icon } from 'antd';

class Loading extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-12" style={{textAlign: "center", justifyContent: "center"}}>
                    <Icon type="loading-3-quarters" spin style={{fontSize: 20}} /> Loading...
                </div>
            </div>
        );
    }
}

export default Loading;