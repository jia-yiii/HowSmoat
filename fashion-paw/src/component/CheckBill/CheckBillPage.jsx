import React, { Component } from 'react';
import axios from 'axios';
import CheckList from '../Cart/CheckList';
import PayWay from './PayWay'
import DeliverWay from './DeliverWay'
import Receipt from './Receipt';
import ConfirmBtn from '../share/ConfirmBtn';
import cookie from 'js-cookie';
import styles from '../Cart/ShoppingCartPage.module.css';
import CBstyles from './CheckBillPage.module.css';
import { CartContext } from '../Cart/CartContext';




class CheckBillPage extends Component {
  state = {
    uid: cookie.get('user_uid'),
    selectedItems: [],
    discountAmount: 0,
    showDetails: false,
    deliveryData: {},     // 來自 DeliverWay
    payMethod: '',        // 來自 PayWay
    receiptData: {},      // 來自 Receipt
  }
  static contextType = CartContext;

  render() {

    const selectedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    const hasNewItem = selectedItems?.some(item => item.condition === "new");
    const { showDetails } = this.state;

    return (
      <>

        {/* title */}
        <div className='my-2 pl-5 pb-2'>
          <h3>填寫付款資料</h3>
        </div>

        <div className='container-fluid'>
          {/* 折疊按鈕 */}
          <div
            className={`mx-4 ${CBstyles.buydetail}`}
            onClick={this.toggleDetails}
          >
            {showDetails ? "隱藏購買商品明細" : "查看購買商品明細"}
          </div>

          {/* 商品資訊明細（折疊內容） */}
          {showDetails && (
            <div className={`mx-4 mb-4 p-3 ${CBstyles.buydetailcontent}`}>
              {selectedItems.map(item => (
                <div key={item.cart_id} className='mb-3'>
                  <div className='d-flex align-items-center'>
                    <img
                      src={
                        item.image
                          ? `${item.image}`
                          : "/media/default/no-image.png"
                      }
                      alt={item.productName}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div className={CBstyles.linknameReset}>{item.productName}</div>
                        <div><span>單價：</span><span className={CBstyles.price}>NT$ {item.unit_price}</span></div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>數量：{item.quantity}</div>
                        <div><span>小計：</span><span className={CBstyles.totalprice}>NT$ {item.unit_price * item.quantity}</span></div>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}

            </div>
          )}
        </div>


        <div className='row justify-content-center px-5 pb-5'>
          {/* 左邊 */}
          <div className="col-12 col-md-9">
            {/* 寄送方式 */}
            <div className='pt-4 px-4'>
              <div className={styles.sectionTitle}>寄送方式</div>
              <div className='border rounded px-1'>
                <DeliverWay
                  onChange={(data) => this.setState({ deliveryData: data })}
                  selectedItems={selectedItems} />
              </div>
            </div>
            <div className='row'>
              {/* 發票資訊 */}
              {hasNewItem &&
                <div className="col-12 col-md-6">
                  <div className='py-4 pl-4'>
                    <div className={styles.sectionTitle}>發票資訊</div>
                    <div className='border rounded px-1'>
                      <Receipt
                        selectedItems={selectedItems}
                        onChange={(data) => this.setState({ receiptData: data })}
                      />
                    </div>
                  </div>
                </div>}

              {/* 付款方式 */}
              <div className="col-12 col-md-6">
                <div className='p-4'>
                  <div className={styles.sectionTitle}>付款方式</div>
                  <div className='border rounded'>
                    <PayWay onChange={(data) => this.setState({
                      payMethod: data.pay_way,
                      cardLast4: data.card_last4
                    })} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右邊 */}
          <div className="col-12 col-md-3">
            {/* 訂單確認 */}
            <div className={`pt-4 ${styles.cooponcart}`}>
              <div className={styles.cartBlock}>
                <p className={styles.cartinsidetitle}>結帳明細</p>
                <CheckList
                  selectedItems={this.state.selectedItems}
                  discountAmount={this.state.discountAmount}
                  onTotalChange={(total) => this.setState({ finalTotal: total })}
                />
                <ConfirmBtn
                  onClick={this.confirmToPay} />
              </div>
            </div>

          </div>
        </div>



      </>
    );
  }
  componentDidMount() {
    const fromCart = localStorage.getItem("fromCart") === "true";
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
    const uid = cookie.get("user_uid");
    console.log("目前使用者", uid)

    if (!fromCart || selectedItems.length === 0) {
      alert("請先從購物車選擇商品");
      window.location.href = "/ShoppingCartPage";
      return;
    }

    localStorage.removeItem("fromCart");

    const discountAmount = Number(localStorage.getItem('discountAmount')) || 0;

    this.setState({ selectedItems, discountAmount });
  }
  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  }
  confirmToPay = async () => {
    const { selectedItems, deliveryData, payMethod, receiptData, cardLast4, finalTotal } = this.state;

    const isNew = selectedItems.some(item => item.condition === "new");

    const missingFields = [];

    // ✅ 根據配送方式決定必填欄位
    let deliveryRequired = ['method', 'receiver_name', 'receiver_phone', 'receiver_address'];

    if (deliveryData.method === '宅配') {
      deliveryRequired.push('city', 'district');
    }

    const deliveryMissing = deliveryRequired.filter(
      (field) => !deliveryData?.[field] || deliveryData[field].trim() === ''
    );

    if (deliveryMissing.length > 0) {
      missingFields.push("寄送資訊");
    }

    // ✅ 檢查付款方式
    if (!payMethod) {
      missingFields.push("付款方式");
    }

    // ✅ 新品需要發票
    if (isNew && (!receiptData?.value || receiptData.value.trim() === "")) {
      missingFields.push("發票資訊");
    }

    // ✅ 如果有缺漏，就 alert 出來
    if (missingFields.length > 0) {
      alert(`請完整填寫以下欄位：\n${missingFields.join("、")}`);
      return;
    }


    const uid = cookie.get("user_uid");
    console.log("目前使用者", uid)

    //更新載具
    if (receiptData.rememberCarrier && receiptData.phoneCarrier) {
      await axios.post('http://localhost:8000/updateDevice', {
        uid,
        device: receiptData.phoneCarrier
      });
    }

    //新增地址
    const { saveThisAddress, receiver_name, receiver_phone, city, district, address } = this.state.deliveryData;

    if (saveThisAddress && receiver_name && receiver_phone && city && district && address) {
      await axios.post('http://localhost:8000/newAddress', {
        uid: uid,
        City: city,
        District: district,
        address,
        AdressName: receiver_name,
        AdressPhone: receiver_phone
      });
    }

    // ✅ 整理訂單項目
    const orderItems = selectedItems.map(item => ({
      pid: item.pid,
      pd_name: item.productName,
      spec: `${item.color} / ${item.condition}`,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      img_path: item.image
    }));

    // ✅ 整理訂單主檔

    // ✅ 根據寄送方式決定 receiver_address 顯示格式
    let finalReceiverAddress = deliveryData.receiver_address;

    if (deliveryData.method === '超商取貨') {
      const store = JSON.parse(localStorage.getItem('selectedCVS')) || null;
      if (store?.storename && store?.storeid) {
        finalReceiverAddress = `${store.storename}（代號：${store.storeid}）`;
      }
    }

    const orderId = "HSM" + Date.now();
    const coupon_code = localStorage.getItem('coupon_code')?.trim() || '';
    const orderData = {
      uid: uid,
      order_type: selectedItems[0]?.condition,
      display_order_num: orderId,
      total_price: finalTotal,
      pay_way: payMethod,
      card_last4: cardLast4 || 2222,
      delivery_method: deliveryData.method,
      receiver_name: deliveryData.receiver_name,
      receiver_phone: deliveryData.receiver_phone,
      receiver_address: finalReceiverAddress,
      receipt: receiptData?.value || '未填',
      coupon_code
    };

    console.log("🧾 訂單資料：", orderData);
    console.log("📦 訂單項目：", orderItems);

    // ✅ 送出訂單資料到後端
    try {
      const res = await axios.post('http://localhost:8000/orders/create', {
        order: orderData,
        items: orderItems
      });

      if (res.status === 200) {
        // ✅ 清除 localStorage 中的購物資料
        localStorage.removeItem('selectedItems');
        localStorage.removeItem('selectedCVS');
        localStorage.removeItem('coupon_code');
        localStorage.removeItem('discountAmount');

        //  1. 移除購物車已結帳項目（Context）
        const { removeFromCart } = this.context;
        selectedItems.forEach(item => {
          removeFromCart(item.cart_id);
        });

        //  2. 後端同步刪除
        for (const item of selectedItems) {
          await axios.delete('http://localhost:8000/cart/remove', {
            data: {
              uid: item.uid,
              pid: item.pid,
              spec: item.spec || null
            }
          });
        }

        // ✅ 3. 判斷付款方式
        if (payMethod === '線上付款') {
          // 👉 綠界付款流程
          const { data } = await axios.post('http://localhost:8000/payment/create-order', {
            orderId,
            amount: orderData.total_price,
            itemName: orderItems.map(item => item.pd_name).join(", ")
          });

          const div = document.createElement('div');
          div.innerHTML = data;
          document.body.appendChild(div);
          div.querySelector('form').submit();

        } else if (payMethod === '貨到付款') {
          // 👉 直接完成訂單，導回首頁
          alert("✅ 訂單已成立，請留意商品配送");
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error("❌ 訂單建立失敗：", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      alert("訂單送出失敗，請稍後再試");
    };
  }
}

export default CheckBillPage;