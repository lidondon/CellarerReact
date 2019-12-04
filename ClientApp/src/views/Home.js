import React, { Component } from 'react';
import { Carousel } from 'antd';

import './Home.css';
import p1 from '../static_files/cellarer1.png';
import p2 from '../static_files/cellarer2.png';
import p3 from '../static_files/cellarer3.png';

class Home extends Component {
    render() {
        const pictures = [ p1, p2, p3 ];

        return (
            <div className="container">
                <Carousel autoplay >
                    {pictures.map(p => <img src={p} alt="picture" />)}
                </Carousel>
            </div>
            
        );
    }
}

export default Home;