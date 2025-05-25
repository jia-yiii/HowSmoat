// AddToCartBtn.jsx
import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { CartContext } from 'component/Cart/CartContext';
import styles from './AddToCartBtn.module.css';

class AddToCartBtn extends Component {
  static contextType = CartContext;

  render() {
    const { type } = this.props;

    return (
      <div className='d-flex align-items-center mt-1 mr-3'>
        {type === "text" ? (
          <button
            className={` ${styles.cartBtn} ${styles.bgbtn}`}
            onClick={this.addToCart}
          >
            加入購物車
          </button>
        ) : (
          <button
            className={`ml-4 ${styles.iconBtn}`}
            onClick={this.addToCart}
          >
            <i className="bi bi-cart" style={{ fontSize: this.props.size || "20px" }}></i>
          </button>
        )}
      </div>

    );
  }

  addToCart = async () => {
    const { addToCart } = this.context;
    const { product, quantity = 1 } = this.props;

    // ✅ 基本資料檢查
    if (!product || !product.pid) {
      alert("⚠️ 商品資料不完整，無法加入購物車");
      return;
    }

    // ✅ 處理價格欄位（避免 undefined 或 NaN）
    const priceSource = product.unit_price !== undefined ? product.unit_price : product.price;
    const parsedPrice = parseInt(priceSource || "0", 10);
    const unit_price = isNaN(parsedPrice) ? 0 : parsedPrice;

    // ✅ 組裝購物車資料格式（給 Context）
    const cartItem = {
      pid: product.pid,
      uid: product.uid,
      condition: product.condition,
      quantity,
      unit_price,
      spec: product.color || product.spec || null,
      pd_name: product.pd_name,
      images: product.images,
    };

    // ✅ 先加入 Context（前端顯示用）
    const result = await addToCart(cartItem);

    // ✅ 若有登入帳號 → 同步寫入資料庫
    const uid = cookie.get("user_uid");
    if (uid) {
      try {
        await axios.post("http://localhost:8000/cart/add", {
          uid, // 買家
          pid: product.pid,
          spec: product.color || product.spec || null,
          quantity,
          unit_price,
        });
        console.log("🧪 加入到資料庫", { pid: product.pid, unit_price, uid, quantity });
      } catch (err) {
        console.error("❌ 同步到後端購物車失敗", err);
        alert("⚠️ 加入購物車時發生錯誤，請稍後再試");
      }
    }

    // ✅ 彈出提示
    if (result === 'new' || result === 'updated') {
      const go = window.confirm("✅ 已加入購物車！是否前往查看？");
      if (go) {
        window.location.href = '/ShoppingCartPage';
      }
    }
  };

}

export default AddToCartBtn;