import React, { Component } from 'react';
import { handleLoginSuccess } from './handleLoginSuccess';
import cookie from 'js-cookie';

export default class SyncCartOnLogin extends Component {
  componentDidMount() {
    console.log("SyncCartOnLogin已觸發")
    const uid = cookie.get("user_uid");
    const merged = localStorage.getItem("cartMerged");
    const localCart = localStorage.getItem("cartList");

    if (uid && !merged && localCart) {
      handleLoginSuccess().then(() => {
        localStorage.setItem("cartMerged", "true");
        console.log("✅ 自動同步購物車完成");
      });
    }
  }

  render() {
    return null; // 這個元件不用顯示任何畫面
  }
}