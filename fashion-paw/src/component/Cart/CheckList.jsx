import React, { Component } from 'react';
import styles from './CheckList.module.css';


class CheckList extends Component {
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedItems !== this.props.selectedItems ||
      prevProps.discountAmount !== this.props.discountAmount
    ) {
      this.sendTotalToParent();
    }
  }

  componentDidMount() {
    this.sendTotalToParent();
  }

  sendTotalToParent = () => {
    const { selectedItems, discountAmount, onTotalChange } = this.props;

    const totalOriginal = selectedItems.reduce((sum, item) => {
      return sum + item.unit_price * item.quantity;
    }, 0);
    const validDiscount = discountAmount > 0 && discountAmount < 1 ? discountAmount : 1;
    const afterDiscount = totalOriginal * validDiscount;
    const shippingFee = afterDiscount < 399 && afterDiscount > 0 ? 70 : 0;
    const finalAmount = Math.round(afterDiscount + shippingFee); // 四捨五入後回傳

    if (onTotalChange) {
      onTotalChange(finalAmount);
    }
  }

  render() {
    const { selectedItems, discountAmount } = this.props;

    const totalOriginal = selectedItems.reduce((sum, item) => {
      return sum + item.unit_price * item.quantity;
    }, 0);
    const validDiscount = discountAmount > 0 && discountAmount < 1 ? discountAmount : 1;
    const afterDiscount = totalOriginal * validDiscount;
    const shippingFee = afterDiscount < 399 && afterDiscount > 0 ? 70 : 0;
    const finalAmount = afterDiscount + shippingFee;
console.log("✅ 傳進來的 selectedItems:", selectedItems);

    return (
      <div className={styles.checkListWrapper}>
        <div className={styles.checkRow}>
          <span>商品小計</span>
          <span>NT$ {totalOriginal.toLocaleString()}</span>
        </div>
        <div className={styles.checkRow}>
          <span>運費</span>
          <span>{shippingFee > 0 ? `+NT$ ${shippingFee}` : "NT$ 0"}</span>
        </div>
        {validDiscount < 1 && (
          <div className={styles.checkRow}>
            <span>折扣</span>
            <span>-{(100 - validDiscount * 100).toFixed(0)}%</span>
          </div>
        )}

        <div className={styles.divider}></div>

        <div className={styles.totalRow}>
          <span>應付總額</span>
          <span>NT$ {Math.round(finalAmount).toLocaleString()}</span>
        </div>
      </div>

    );
  }
}

export default CheckList;