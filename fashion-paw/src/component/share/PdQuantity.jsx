import React, { Component } from 'react';
import styles from './PdQuantity.module.css'

class PdQuantity extends Component {
    render() {
        const { quantity, max } = this.props
        const reachMax = max !== undefined && quantity >= max;
        const reachMin = !this.props.allowZero && quantity <= 1;
        const disabledMax = max !== undefined && quantity >= max
        const disabledMin = !this.props.allowZero && quantity <= 1;
        return (
            <>
                {/* <h1>加入購物車</h1> */}
                <div className='d-flex align-items-center my-3'>
                    {/* 減少按鈕 */}
                    <button
                        className={`
    ${styles.quantityBtn} 
    ${disabledMin ? styles.quantityBtnDisabled : styles.quantityBtnActive}
  mx-2`}
                        onClick={this.quantityDown}
                        disabled={reachMin}
                    >
                        <i className="bi bi-dash-lg"></i>
                    </button>
                    {/* 數量格子 */}
                    <div
                        style={{
                            width: 60,
                        }}>
                        <input className='w-100 text-center' type="text" value={this.props.quantity}
                            onChange={this.inputChange} />
                    </div>
                    {/* 增加按鈕 */}
                    <button
                        className={`${styles.quantityBtn} ${disabledMax ? styles.quantityBtnDisabled : styles.quantityBtnActive} mx-2`}
                        onClick={this.quantityUp}
                        disabled={reachMax}
                    >
                        <i className="bi bi-plus-lg"></i>
                    </button>
                </div>
            </>
        );
    }
    inputChange = (e) => {
        const value = e.target.value
        if (value === "") {
            this.props.onQuantityChange("")
        } else {
            const number = parseInt(value)
            if (!isNaN(number) && number >= 1) {
                this.props.onQuantityChange(number)
            }
        }
    }
    quantityDown = () => {
        // alert("Down")
        const { quantity, onQuantityChange, allowZero } = this.props;

        if (allowZero && quantity === 1) {
            onQuantityChange(0); // 允許變成 0
        } else if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    }
    quantityUp = () => {
        // alert("Up")
        const { quantity, onQuantityChange, max } = this.props;
        const nextQty = quantity + 1;
        if (max === undefined || nextQty <= max) {
            onQuantityChange(nextQty);
        }
    }
}

export default PdQuantity;