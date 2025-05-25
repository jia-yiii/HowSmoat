const express = require('express');
const moment = require('moment');
const router = express.Router();
// const ecpay_payment = require('../utils/ecpay-sdk/lib/ecpay_payment.js');
const ecpay_payment = require('ecpay_aio_nodejs'); //原引用 lib/ecpay_payment.js，改用套件比較容易管理版本
const { options, HOST } = require('../utils/ecpay-sdk/conf/config.js')
const mysql = require("mysql");
const util = require("util");

const conn = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: 3306,
  database: "howsmoat"
});

const q = util.promisify(conn.query).bind(conn);


// 建立訂單，導向綠界付款頁
router.post('/create-order', (req, res) => {
    const { orderId, amount, itemName } = req.body;

    const base_param = {
        MerchantTradeNo: orderId,
        MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
        TotalAmount: String(amount),
        ItemName: itemName,
        TradeDesc: '好拾毛寵物購物網 - 付款', 
        ReturnURL: `${HOST}/payment/return`,
        ClientBackURL: `${HOST}/payment/clientReturn`,
        EncryptType: 1
    };

    const create = new ecpay_payment(options);
    const html = create.payment_client.aio_check_out_all(base_param);

    //  直接用 res.send() 回傳整段 HTML
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>正在導向綠界付款頁...</title>
        </head>
        <body>
          <h2>請稍候，正在導向綠界付款頁...</h2>
          ${html}
        </body>
      </html>
    `);
});

// 綠界背景通知
router.post('/return', express.urlencoded({ extended: false }), async (req, res) => {
    console.log("⚠️ 有收到來自綠界的 POST 請求");
    console.log('🔁 綠界回傳參數:', req.body);
  
    const {
      MerchantTradeNo,
      RtnCode,
      CheckMacValue,
      PaymentType,
      Card4No,
    } = req.body;
    console.log(req.body.Card4No)

  
    // ✅ 驗證 CheckMacValue
    const create = new ecpay_payment(options);
    const bodyCopy = { ...req.body };
    delete bodyCopy.CheckMacValue;
    const verifyMac = create.payment_client.helper.gen_chk_mac_value(bodyCopy);
  
    if (CheckMacValue !== verifyMac) {
      console.warn('❌ CheckMacValue 驗證失敗');
      return res.status(400).send('CheckMacValue mismatch');
    }
  

    const paymentTypeMap = {
      "Credit_": "信用卡",
      "TWQR_": "行動支付",
      "Wechatpay_": "微信支付",
      "WebATM_": "網路ATM",
      "ATM_": "ATM虛擬帳號",
      "BARCODE_": "超商條碼",
      "CVS_": "超商代碼",
      "ECPay_": "綠界Pay"
    };
    
    function convertPaymentType(rawType) {
      for (const prefix in paymentTypeMap) {
        if (rawType.startsWith(prefix)) {
          return paymentTypeMap[prefix];
        }
      }
      return rawType; // 若沒有對應就回傳原始值
    }
    if (RtnCode === '1') {
      try {
        const readablePaymentType = convertPaymentType(PaymentType);
        // ✅ 更新訂單資料庫
        await q(
          `UPDATE orders 
           SET pay_way = ?, card_last4 = ?
           WHERE display_order_num = ?`,
          [readablePaymentType, Card4No || null, MerchantTradeNo]
        );
  
        console.log(`✅ 訂單更新完成：訂單編號 ${MerchantTradeNo}，付款方式 ${readablePaymentType}，卡號末四碼 ${Card4No || '無'}`);
        return res.send('1|OK');
      } catch (err) {
        console.error('❌ 更新訂單時發生錯誤:', err);
        return res.status(500).send('資料庫錯誤');
      }
    } else {
      console.warn(`⚠️ 綠界回傳失敗，RtnCode=${RtnCode}`);
      return res.send('0|FAIL');
    }
  });
  
// 使用者付款完後回到此頁
router.get('/clientReturn', (req, res) => {
    console.log('使用者完成付款導回:', req.query);
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>付款完成</title>
        <meta http-equiv="refresh" content="2;url=http://localhost:3000/" />
      </head>
      <body>
        <h2>付款完成，2 秒後自動跳轉回首頁...</h2>
        <p>如果沒有跳轉，請 <a href="http://localhost:3000/">點此回首頁</a></p>
      </body>
    </html>
  `);
});

module.exports = router;