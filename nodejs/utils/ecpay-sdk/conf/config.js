require('dotenv').config(); 
const { MERCHANTID, HASHKEY,HASHIV, HOST}= process.env;


const options = {
  "OperationMode": "Test", //Test or Production
  "MercProfile": {
    "MerchantID": MERCHANTID,
    "HashKey": HASHKEY,
    "HashIV": HASHIV
  },
  "IgnorePayment": [
//    "Credit",
//    "WebATM",
//    "ATM",
//    "CVS",
//    "BARCODE",
//    "AndroidPay"
  ],
}
// console.log('[DEBUG] MERCHANTID:', MERCHANTID);
// console.log('[DEBUG] HASHKEY:', HASHKEY);
// console.log('[DEBUG] HASHIV:', HASHIV);

// 將綠界付款設定與環境變數一併匯出，供 payment 使用
module.exports = {options,HOST}