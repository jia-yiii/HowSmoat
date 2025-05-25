import './ShoppingCartPage.module.css';
import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import CartList from './CartList';
import SellerTitle from './SellerTitle';
import Coupon from './Coupon';
import CheckList from './CheckList';
import ConfirmBtn from '../share/ConfirmBtn';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import styles from './ShoppingCartPage.module.css';

class ShoppingCartPage extends Component {
  static contextType = CartContext;
  state = {
    coupon: "discount88",
    discountAmount: 0,
    selectedItems: [],  //有勾選的 cart_id
  };

  render() {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    // console.log("🛒 購物車頁面收到的 cartList：", cartList);


    // 分類：新品 & 二手
    const newItems = cartList.filter(item => item.condition === "new");
    const secondItems = cartList.filter(item => item.condition === "second");

    // 二手商品依賣家分組
    const secondItemsBySeller = {};
    secondItems.forEach(item => {
      const sellerUid = item.seller_uid;
      if (!secondItemsBySeller[sellerUid]) {
        secondItemsBySeller[sellerUid] = [];
      }
      secondItemsBySeller[sellerUid].push(item);
    });
    // console.log("🧪 全部購物車 cartList：", cartList);
    return (
      <>
        {/* title */}
        <div className={styles.pageWrapper}>
          <div className="pb-2">
            <h3>購物車</h3>
          </div>

          {/* 開發用：清空 localStorage 按鈕 */}
          {/* <div className="text-end my-3 px-4">
            <button className="btn btn-outline-danger btn-sm" onClick={() => this.context.clearCart()}>
              🧹 清空購物車（Context + localStorage）
            </button>
          </div> */}

          {cartList.length === 0 && (
            <div className={styles.emptyCartNotice}>
              <h5>🛒 購物車內還沒有商品～快去逛逛吧！</h5>
              <Link to="/ProductPage" className='mx-2 btn paw-btn-outline-pri-darkbrown'>逛逛新品</Link>
              <Link to="/SeProductPage" className='mx-2 btn paw-btn-outline-pri-darkbrown'>找找二手</Link>
            </div>
          )}

          {cartList.length > 0 && (
            <div className='row g-1 justify-content-center'>
              <div className="col-12 col-md-9">
                {newItems.length > 0 && (
                  <div className='pe-md-4'>
                    {/* 新品購物車 */}
                    <div className={styles.sectionTitle}>拾毛新品百貨</div>

                    <div className={styles.cartBlock}>
                      <div className='d-flex align-items-center p-2 border-bottom'>
                        <input
                          id='selectAll'
                          type='checkbox'
                          checked={this.allSelected()}
                          onChange={this.toggleSelectAll}
                          className='me-2 mx-2'
                        />
                        <label htmlFor='selectAll' className='pt-1'>全選</label>
                      </div>

                      {newItems.map(item => (
                        <CartList
                          key={item.cart_id}
                          item={item}
                          selected={selectedItems.includes(String(item.cart_id))}
                          onSelectedChange={this.selectChange}
                          onQuantityChange={this.changeQuantity}
                          onDelete={this.deleteCartItem}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 二手購物車 */}
                {secondItems.length > 0 && (
                  <div className='ps-md-0'>
                    <div className={styles.sectionTitle}>拾毛二手市場</div>

                    {Object.keys(secondItemsBySeller).map(uid => (
                      <div key={uid} className={styles.cartBlock}>
                        <div className='d-flex align-items-center px-1 border-bottom'>
                          <input
                            id={`selectAll-${uid}`}
                            type='checkbox'
                            checked={this.sellerAllSelected(uid)}
                            onChange={() => this.toggleSellerSelectAll(uid)}
                            className='me-1 ml-2'
                          />
                          <label htmlFor={`selectAll-${uid}`} className='pt-1'>
                            <label className='pl-3 ' htmlFor={`selectAll-${uid}`}>
                              <SellerTitle uid={String(uid)} />
                            </label></label>
                        </div>


                        {secondItemsBySeller[uid].map(item => (
                          <CartList
                            key={item.cart_id}
                            item={item}
                            selected={selectedItems.includes(String(item.cart_id))}
                            onSelectedChange={this.selectChange}
                            onQuantityChange={this.changeQuantity}
                            onDelete={this.deleteCartItem}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-3">
                <div className={`pl-3 ${styles.cooponcart}`}>
                  {/* <div className={styles.sectionTitle}>折價券</div> */}
                  <div className={styles.cartBlock}>
                    <p className={styles.cartinsidetitle}>折價券</p>
                    <Coupon onApplyDiscount={this.applyDiscount} />
                  </div>
                </div>

                <div className={`pl-3 ${styles.cooponcart}`}>
                  {/* <div className={styles.sectionTitle}>結帳明細</div> */}
                  <div className={styles.cartBlock}>
                    <p className={styles.cartinsidetitle}>結帳明細</p>
                    <CheckList
                      selectedItems={cartList.filter(item => selectedItems.includes(item.cart_id))}
                      discountAmount={this.state.discountAmount}
                    />
                    <ConfirmBtn type="toPayPage" onClick={this.goToCheckBillPage} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </>
    );
  }
  prevFetchedUids = [];

  componentDidUpdate() {
    const { cartList, setSellers } = this.context;

    const secondUids = [...new Set(
      cartList
        .filter(item => item.condition === "second" && item.seller_uid)
        .map(item => String(item.seller_uid))
    )];

    // 檢查：是否有「新加入但之前沒抓過」的 uid
    const newUids = secondUids.filter(uid => !this.prevFetchedUids.includes(uid));

    if (newUids.length > 0) {
      axios.get(`http://localhost:8000/get/userinfo`)
        .then(res => {
          const uidSet = new Set(secondUids);
          const matchedUsers = res.data.filter(user =>
            uidSet.has(String(user.uid))
          );
          console.log("✅ 更新抓 seller：", matchedUsers);
          setSellers(matchedUsers);
          this.prevFetchedUids = secondUids; // ✅ 更新追蹤過的 uid
        })
        .catch(err => {
          console.error("❌ 抓 seller 錯誤：", err);
        });
    }
  }

  componentDidMount() {
    const uid = cookie.get("user_uid");


    // 撈後端購物車資料
    if (uid) {
      // 清除 localStorage（避免合併重複）
      localStorage.removeItem("cartList");

      axios.get(`http://localhost:8000/cart/${uid}`)
        .then(async res => {
          const dbCart = res.data;
          console.log("🛒 撈回購物車資料：", dbCart);

          this.context.clearCart();
          const { normalizeCartItem } = this.context;

          for (let item of dbCart) {
            await this.context.addToCart(item);
          }

       console.log("🛒 撈回購物車資料：", dbCart);
          console.log("✅ 已從資料庫載入購物車，共：", dbCart.length, "筆");
        });
    }

    this.setState({ selectedItems: [] });
  }


  //新品全選
  allSelected = () => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const newItems = cartList.filter(item => item.condition === "new");
    return newItems.every(item => selectedItems.includes(String(item.cart_id)));

  }

  toggleSelectAll = () => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const newItems = cartList.filter(item => item.condition === "new");
    const allIds = newItems.map(item => String(item.cart_id));

    if (this.allSelected()) {
      // 取消選取
      const updated = selectedItems.filter(id => !allIds.includes(String(id)));
      this.setState({ selectedItems: updated });
    } else {
      // 全選
      const updated = Array.from(new Set([...selectedItems, ...allIds]));
      this.setState({ selectedItems: updated });
    }
  }
  //二手全選
  // 檢查是否該賣家的商品都有被選
  sellerAllSelected = (uid) => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const sellerItems = cartList.filter(
      item => item.condition === 'second' && String(item.seller_uid) === String(uid)
    );

    return sellerItems.every(item => selectedItems.includes(String(item.cart_id)));
  };


  // 切換賣家區域的全選 / 取消
  toggleSellerSelectAll = (uid) => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const sellerItems = cartList.filter(
      item => item.condition === 'second' && String(item.seller_uid) === String(uid)
    );
    const sellerIds = sellerItems.map(item => String(item.cart_id));

    if (this.sellerAllSelected(uid)) {
      const updated = selectedItems.filter(id => !sellerIds.includes(id));
      this.setState({ selectedItems: updated });
    } else {
      const updated = Array.from(new Set([...selectedItems, ...sellerIds]));
      this.setState({ selectedItems: updated });
    }
  };


  selectChange = (changeId) => {
    const idStr = String(changeId);
    this.setState(prevState => {
      const isSelected = prevState.selectedItems.includes(idStr);
      const newSelectedItems = isSelected
        ? prevState.selectedItems.filter(id => id !== idStr)
        : [...prevState.selectedItems, idStr];
      return { selectedItems: newSelectedItems };
    });
  };

  changeQuantity = (cartId, newQuantity) => {
    const { updateQuantity, removeFromCart, cartList } = this.context;
    const targetItem = cartList.find(item => item.cart_id === cartId);

    if (!targetItem) return;

    if (newQuantity < 1) {
      const deletePd = window.confirm("要將此商品從購物車移除嗎？");
      if (deletePd) {
        removeFromCart(cartId);
      }
      return;
    }

    // ✅ 前端先更新 context
    updateQuantity(cartId, newQuantity);

    // ✅ 同步寫入資料庫
    axios.put("http://localhost:8000/cart/update", {
      uid: targetItem.uid,
      pid: targetItem.pid,
      spec: targetItem.spec || null,
      quantity: newQuantity
    }).then(() => {
      // console.log("✅ 數量已同步資料庫");
    }).catch(err => {
      console.error("❌ 購物車數量更新失敗", err);
    });
  };

  applyDiscount = (discountAmount) => {
    this.setState({ discountAmount });
  }

  deleteCartItem = (cartId) => {
    const { removeFromCart, cartList } = this.context;
    const targetItem = cartList.find(item => item.cart_id === cartId);
    if (!targetItem) return;

    this.setState((prev) => ({
      selectedItems: prev.selectedItems.filter((id) => id !== String(cartId)),
    }));

    removeFromCart(cartId); // 先從 Context 移除

    // 後端刪除
    axios.delete("http://localhost:8000/cart/remove", {
      data: {
        uid: targetItem.uid,
        pid: targetItem.pid,
        spec: targetItem.spec || null
      }
    }).then(() => {
      // console.log("✅ 資料庫已刪除購物車商品");
    }).catch(err => {
      console.error("❌ 刪除購物車商品失敗", err);
    });
  };

  goToCheckBillPage = () => {
    const { selectedItems, discountAmount } = this.state;
    const { cartList } = this.context;

    const selectedCartItems = cartList.filter(item =>
      selectedItems.includes(String(item.cart_id))
    );

    if (selectedItems.length === 0) {
      return alert("還沒有選擇商品");
    }

    const selectedConditions = new Set(selectedCartItems.map(item => item.condition));
    if (selectedConditions.size > 1) {
      return alert("新品與二手商品不能同時結帳，請分開操作");
    }

    if (selectedConditions.has("second")) {
      const sellerUids = new Set(selectedCartItems.map(item => item.uid));
      if (sellerUids.size > 1) {
        return alert("二手商品每次只能結帳一位賣家的商品，請調整勾選內容");
      }
    }

    // ✅ 加入 flag，供 CheckBillPage 驗證是否從購物車進入
    localStorage.setItem('fromCart', 'true');

    localStorage.setItem('selectedItems', JSON.stringify(selectedCartItems));
    localStorage.setItem('discountAmount', discountAmount);

    window.location.href = '/CheckBillPage';
  };
}

export default ShoppingCartPage;