import React, { Component } from 'react';

import './IconInput.css';

class IconInput extends Component {
    render() {
        const { icon, type, placeHolder, onChange, value, isError } = this.props;
        let error = isError ? "error" : "";
        
        return (
            <div className="form-group">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className={icon}></i> </span>
                    </div>
                    <input value={value} name="" className={`form-control ${error}`} placeholder={placeHolder} type={type} onChange={onChange}/>
                </div> 
            </div> 
        );
    }
}

export default IconInput;