import axios from 'axios';
import cookie from 'js-cookie';

export const handleLoginSuccess = async () => {
  const uid = cookie.get("user_uid"); // 讀取登入者 uid
  if (!uid) return;

  const localCart = JSON.parse(localStorage.getItem("cartList") || "[]");
  if (localCart.length === 0) return;

  const cartToSync = localCart.map(item => ({
    ...item,
    uid,
    spec: item.color || item.spec || null
  }));

  try {
    await axios.post("http://localhost:8000/cart/merge", {
      cartList: cartToSync
    });

    console.log("✅ 購物車已合併入資料庫");

    // ✅ 清除 localStorage
    localStorage.removeItem("cartList");
    localStorage.removeItem("sellers");
  } catch (err) {
    console.error("❌ 合併購物車失敗", err);
  }
};