// src/component/Third_SetCookie.jsx
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import cookie from 'js-cookie';

class Third_SetCookie extends Component {
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const uid = params.get("uid");
    const power = params.get("user_power")

    if (uid) {
      cookie.set('user_uid', uid, { expires: 1, sameSite: 'Lax' });
      if (power) {
        cookie.set('user_power', power, { expires: 1, sameSite: 'Lax' });
      }
      console.log("🍪 已在前端寫入 user_uid =", uid);
      window.location.href = '/'; // 登入後導回首頁
    } else {
      console.error("❌ 未提供 uid");
      window.location.href = '/login';
    }
  }

  render() {
    return <div>登入成功，導向中...</div>;
  }
}

export default withRouter(Third_SetCookie);