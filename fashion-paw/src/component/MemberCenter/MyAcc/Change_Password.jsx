import React, { Component } from 'react';
import axios from 'axios';
import styles from './Change_Password.module.css'

class Change_Password extends Component {
    state = {
        token: '',
        verified: false,
        email: '',
        newPassword: '',
        confirmPassword: '',
        status: ''
    };

    componentDidMount() {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
            this.setState({ status: '❌ 缺少 token，無法進入頁面' });
            return;
        }

        this.setState({ token }, this.verifyToken);
    }

    verifyToken = async () => {
        try {
            const res = await axios.post('http://localhost:8000/password/verify-token', {
                token: this.state.token
            });

            if (res.data.success) {
                // 模擬登入，寫入 localStorage
                localStorage.setItem('resetEmail', res.data.email);
                this.setState({ verified: true, email: res.data.email });
            } else {
                this.setState({ status: '❌ Token 無效或已過期' });
            }
        } catch (err) {
            this.setState({ status: '❌ 無法驗證 token' });
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword, token } = this.state;

        if (!newPassword || !confirmPassword) {
            return this.setState({ status: '請輸入新密碼與確認密碼' });
        }

        if (newPassword !== confirmPassword) {
            return this.setState({ status: '兩次密碼不一致' });
        }

        try {
            const res = await axios.post('http://localhost:8000/password/reset-password', {
                token,
                newPassword
            });

            if (res.data.success) {
                this.setState({ status: '✅ 密碼更改成功，請重新登入' });
                localStorage.removeItem('resetEmail');
            
                // 兩秒後導向登入頁面
                setTimeout(() => {
                    window.location.href = '/Login'; 
                }, 1000);
            } else {
                this.setState({ status: '❌ ' + res.data.message });
            }
        } catch (err) {
            this.setState({ status: '❌ 修改失敗' });
        }
    };

    render() {
        const { verified, newPassword, confirmPassword, status } = this.state;

        if (!verified) return <p className="text-danger my-4">{status}</p>;

        return (
            <>
                <h3>更改密碼</h3>
                <form onSubmit={this.handleSubmit}>
                    <label>新密碼</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => this.setState({ newPassword: e.target.value })}
                        className="form-control mb-3"
                    />
                    <label>確認密碼</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                        className="form-control mb-3"
                    />
                    <input type="submit" value="確認更改" className={styles.btnsubmit} />
                </form>
                {status && <p className="text-info mt-3">{status}</p>}
            </>
        );
    }
}

export default Change_Password;