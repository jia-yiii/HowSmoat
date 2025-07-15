## 🐾 好拾毛｜寵物用品電商網站

### 我負責的功能開發包含：
- 購物車全功能（含 localStorage 合併與數量限制）
- 結帳頁面資料串接與金流整合
- 商品詳情頁資料串接、動態渲染與評論切換
- 後端路由撰寫與 Gmail OAuth2 驗證功能
- 實作第三方登入（Google / Line）
- [作品簡報](https://docs.google.com/presentation/d/1A8ZjHB-7j530-yp74gex5Pa-ZHD2-y0F/edit?usp=sharing&ouid=114015330288415401537&rtpof=true&sd=true)

---

### 前端 React（資料夾：`fashion-paw`）

#### 購物車功能
- 路徑：`fashion-paw/src/component/Cart`
- 功能：
  - 加入／刪除購物車商品
  - 數量調整與庫存限制
  - 勾選商品結帳邏輯
  - 未登入時使用 localStorage，登入後自動合併購物車

#### 結帳流程
- 路徑：`fashion-paw/src/component/CheckBill`
- 功能：
  - 送貨方式、付款方式、發票資訊填寫表單
  - 整合第三方金流（綠界 ECPay）
  - 完成訂單後更新庫存

#### 商品詳情頁
- 路徑：`fashion-paw/src/component/ProductDetailPage`
- 功能：
  - 顯示商品圖片、規格、庫存、賣家資訊
  - 支援加入購物車／收藏
  - 顯示賣家或商品評論

---

### 後端 Node.js（資料夾：`nodejs`）

#### 路由設定：`nodejs/routes`
- `cvs.js`：接收超商地圖門市資料並重導回前端
- `payment.js`：金流串接，接收綠界付款回傳訊息
- `resetPassword.js`、`verify.js`：密碼重設與信箱驗證流程
- `authGoogle.js`、`authLine.js`：第三方登入 API

#### 工具模組：`nodejs/utils`
- `sendResetPasswordEmail.js`：寄送密碼重設信件（Gmail OAuth2）
- `sendVerificationEmail.js`：寄送註冊驗證碼
- `passportGoogle.js`、`passportLine.js`：第三方登入策略設定
- `initPassportAuth.js`：Passport 初始化整合

#### 資料存取與 API：`sql.js`
- 提供 MySQL 資料庫查詢封裝
- 所有後端路由統一透過 `q()` 呼叫 SQL 取得資料

---

### 📌 備註

- 我在本次專案中以 React Class Component 為主要架構。
- 採用 Context API 管理購物車狀態。
- 金流測試資料使用綠界科技測試帳號。
- 機密金鑰與設定統一管理於本地 `.env` 檔案，確保部署與開發安全性
