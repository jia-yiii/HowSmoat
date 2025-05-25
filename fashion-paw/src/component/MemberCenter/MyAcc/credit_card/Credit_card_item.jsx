import React, { Component } from 'react';
import styles from '../Credit_Card.module.css'

class Credit_Card_item extends Component {
    state = {
        card: {
            id: 1,
            card_num: "5500 0000 0000 0000",
            last4: "5500",
            holder: "HENRY KO",
            expiry: "05/32"
        }
    };

    static getDerivedStateFromProps(nextProps, nextState) {
        // 比對是否需要更新 state.card
        if (nextProps.card !== nextState.card) {
            return {
                card: nextProps.card,
            };
        }
        return null; // 不需要更新 state
    }

    delete = () => {
        if (window.confirm(`確定要刪除尾號${this.state.card.last4}信用卡嗎?`)) {
            // console.log(this.props.key);

            
            this.props.delete();
        }
    };

    brandjudge = () => {
        let number = this.state.card.card_num;
        if (number.startsWith('4')) return 'VISA';
        if (/^5[1-5]/.test(number)) return 'MasterCard';
        if (/^3[47]/.test(number)) return 'American Express';
        if (number.startsWith('35')) return 'JCB';
        return 'Unknown';
    };

    render() {
        let { card } = this.props;
        return (
            <div className="card mb-3 p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>{this.brandjudge()} -  {card.card_num}</h5>
                        
                        <p className="mb-1">有效期限：{card.expiry}</p>
                    </div>
                    <div>
                        <button className={styles.btndel} onClick={this.delete}>
                            刪除
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Credit_Card_item;
