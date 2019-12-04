import React, { Component } from 'react';

class IconInput extends Component {
    render() {
        const { icon, type, placeHolder, onChange, value } = this.props;
        
        return (
            <div className="form-group">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className={icon}></i> </span>
                    </div>
                    <input value={value} name="" className="form-control" placeholder={placeHolder} type={type} onChange={onChange}/>
                </div> 
            </div> 
        );
    }
}

export default IconInput;