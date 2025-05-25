import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import styles from './Coupon.module.css'

class Coupon extends Component {
  state = {
    coupon: '',
    discountAmount: 0,
    applied: false,     // 是否已套用折扣
    availableCoupons: [],  // 後端折扣碼清單
    showList: false,
    appliedCouponCode: '',
    isLoggedIn: !!cookie.get('user_uid'), // 判斷是否登入
  };

  render() {
    const { coupon, applied, discountAmount, showList, availableCoupons } = this.state;

    return (
      <div className={styles.couponcontainer}>

        <div className={styles.coupontogglewrap}>
          <button
            className={styles.coupontogglebtn}
            onClick={this.toggleCouponList}
          >
            {showList ? '收起折扣碼 ▲' : '點我看折扣 ▼'}
          </button>

          {showList && availableCoupons.length === 0 && (
            <p className={styles.couponemptymsg}>{this.state.isLoggedIn ? '尚無可用折扣碼' : '請先登入才能使用折扣碼'}</p>
          )}

          {showList && availableCoupons.length > 0 && (
            <div className={styles.couponlist}>
              {availableCoupons.map((c, idx) => {
                const isUsed = c.coupon_code === this.state.appliedCouponCode;

                return (
                  <div
                    key={idx}
                    className={`${styles.couponcard} ${isUsed ? styles.used : ''}`}
                    onClick={() => {
                      if (isUsed) {
                        // ✅ 取消套用
                        this.cancelCoupon();
                      } else {
                        this.applyCouponFromList(c.coupon_code);
                      }
                    }}
                  >
                    <div className={styles.coupondiscount}>{c.discount_ratio * 100} 折</div>
                    <div className={styles.couponinfo}>
                      <div className={styles.couponcode}>{c.coupon_code}</div>
                      <div className={styles.coupondescription}>{c.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {applied && (
          <div className={styles.couponsuccessmsg}>
            折扣碼「{this.state.appliedCouponCode}」已套用成功！已享 {discountAmount * 100} 折優惠 ✨
          </div>
        )}
      </div>
    );
  }

  inputChange = (e) => {
    this.setState({ coupon: e.target.value });
  };

  showCoupons = async () => {
    const uid = cookie.get('user_uid');
    console.log("🔍 目前登入 UID：", uid); // 加這行
    if (!uid) {
      this.setState({ isLoggedIn: false });
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/coupons/${uid}`);
      this.setState({ availableCoupons: res.data, showList: true });
    } catch (err) {
      console.error("❌ 載入折扣碼失敗", err);
    }
  };

  cancelCoupon = () => {
    this.setState({
      applied: false,
      discountAmount: 0,
      coupon: '',
      appliedCouponCode: ''
    });

    localStorage.removeItem('coupon_code'); // ✅ 清除本地記錄
  };

  applyCoupon = (code = this.state.coupon) => {
    const { availableCoupons } = this.state;

    const codeStr = String(code).trim().toLowerCase(); // ✅ 強制轉字串再比對

    const matched = availableCoupons.find(c =>
      c.coupon_code.toLowerCase() === codeStr
    );

    if (matched) {
      const discountValue = parseFloat(matched.discount_ratio);
      localStorage.setItem('coupon_code', matched.coupon_code);
      this.setState({
        applied: true,
        discountAmount: discountValue,
        coupon: matched.coupon_code,
        appliedCouponCode: matched.coupon_code
      });
      this.props.onApplyDiscount?.(discountValue);
    } else {
      alert('折扣碼無效');
    }

    console.log("📦 套用折扣碼 matched：", matched);
  };

  toggleCouponList = () => {
    this.setState(
      prev => ({ showList: !prev.showList }),
      () => {
        if (this.state.showList && this.state.availableCoupons.length === 0) {
          this.showCoupons();
        }
      }
    );
  };

  applyCouponFromList = (code) => {
    this.applyCoupon(code); // ✅ 直接傳入 code，避免 undefined
  };


}

export default Coupon;