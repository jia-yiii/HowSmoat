import React, { Component } from 'react';
import styles from './Step.module.css'

class Step extends Component {
    // 註冊上面的步驟圈圈
    render() {
        const stylelist = {
            height: '70px',
            width: '70px',
            borderRadius: '50%',
            backgroundColor: this.props.statement ? '#E1C599' : '#F7F6EE',
            boxShadow: this.props.statement
                ? '0 1px 10px rgba(0, 0, 0, 0.3)'
                : 'none',
            transition: 'all 0.3s ease'
        };

        return (
            <div className="col-4">
                <div
                    className="step border mx-auto d-flex justify-content-center align-items-center"
                    style={stylelist}
                >
                    {this.props.number}
                </div>
                <div className="text-center">
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Step;
