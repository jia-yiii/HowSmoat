import React, { Component } from 'react';
import axios from 'axios';

class AutoLoginByToken extends Component {
  state = {
    status: '登入中，請稍候...'
  };

  async componentDidMount() {
    const token = new URLSearchParams(window.location.search).get('token');
    // console.log('✅ 取得 URL token:', token);

    if (!token) {
      return this.setState({ status: '❌ 缺少驗證資訊' });
    }

    try {
      const res = await axios.post('http://localhost:8000/password/verify-token', {
        token
      });

      if (res.data.success) {
        // 登入成功
        localStorage.setItem('userEmail', res.data.email);
        this.setState({ status: '✅ 登入成功，前往修改密碼中...' });

        // 直接使用 token 變數（避免非同步問題）
        setTimeout(() => {
          window.location.href = `/MemberCenter/change-password?token=${token}`;
        }, 1500);
      } else {
        this.setState({ status: '❌ 此連結無效或已過期' });
      }
    } catch (err) {
      this.setState({ status: '❌ 驗證失敗，請稍後再試' });
    }
  }

  render() {
    return (
      <div className="container my-5">
        <h3>{this.state.status}</h3>
      </div>
    );
  }
}

export default AutoLoginByToken;