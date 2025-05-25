import React, { Component } from 'react';
import axios from 'axios';
import styles from './StepEmail.module.css'

class StepEmail extends Component {
    constructor(props) {
        super(props)
        this.gotoemail = React.createRef();
        this.state = {
            email: '',
            code: '',
            status: '',
            sending: false,
            verifying: false,
            cooldown: 0, // 發送間隔秒數
            codeExpiresAt: null, // 驗證碼過期時間
            timeNow: Date.now() // 用於觸發重新渲染
        };
        this.checkVerifyCode = this.checkVerifyCode.bind(this);
    }

    // 每秒更新狀態
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({ timeNow: Date.now() });
        }, 1000);

    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // 發送驗證碼
    sendVerifyCode = async (event) => {
        event.preventDefault();
        const { email } = this.state;

        if (!email) {
            this.setState({ status: '請輸入 email' });
            return;
        }

        try {
            this.setState({ sending: true, status: '發送中...' });
            const response = await axios.post('http://localhost:8000/verify/send-verification-code', { email });

            if (response.data.success) {
                const expires = Date.now() + 10 * 60 * 1000; // 10 分鐘
                this.setState({
                    status: '✅ 驗證碼已寄出，請至信箱查看',
                    codeExpiresAt: expires,
                    cooldown: 60 // 禁用再次發送 60 秒
                });

                // 啟動 cooldown 計時器
                this.startCooldownTimer();
            } else {
                this.setState({ status: '❌ 發送失敗：' + response.data.message });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({ status: '❌' + error.response.data.message });
            } else {
                this.setState({ status: '❌ 發送失敗（伺服器錯誤）' });
            }
        } finally {
            this.setState({ sending: false });
        }
    };

    // 開始倒數計時
    startCooldownTimer = () => {
        const interval = setInterval(() => {
            this.setState(prev => {
                if (prev.cooldown <= 1) {
                    clearInterval(interval);
                    return { cooldown: 0 };
                }
                return { cooldown: prev.cooldown - 1 };
            });
        }, 1000);
    };

    // 驗證驗證碼
    checkVerifyCode = async (event) => {
        event.preventDefault();
        const { email, code } = this.state;

        if (!email || !code) {
            this.setState({ status: '請輸入 email 與驗證碼' });
            return;
        }

        try {
            this.setState({ verifying: true, status: '驗證中...' });
            const response = await axios.post('http://localhost:8000/verify/verify-code', { email, code });

            if (response.data.success) {
                this.setState({ status: '✅ 驗證成功！' });


                const gotoemail = this.gotoemail.current.value;
                this.props.getemail(gotoemail);


                this.props.next(); //  驗證通過才進下一步
            } else {
                this.setState({ status: '❌ 驗證失敗：' + response.data.message });
            }
        } catch (error) {
            this.setState({ status: '❌ 驗證失敗（伺服器錯誤）' })
            console.log(error);
            ;
        } finally {
            this.setState({ verifying: false });
        }
    };

    render() {
        const { email, code, status, sending, verifying, cooldown, codeExpiresAt, timeNow } = this.state;

        const remainingExpireSec = codeExpiresAt
            ? Math.max(0, Math.floor((codeExpiresAt - timeNow) / 1000))
            : 0;

        // const expireDisplay = codeExpiresAt
        //     ? remainingExpireSec > 0
        //         ? `驗證碼剩餘 ${Math.floor(remainingExpireSec / 60)}分${remainingExpireSec % 60}秒`
        //         : `❌ 驗證碼已過期`
        //     : null;
        return (
            <div className={styles.Wrapper}>
                <div className={styles.formRow}>
                    <label className={styles.label}>Email：</label>
                    <input
                        name="email"
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => this.setState({ email: e.target.value })}
                        ref={this.gotoemail}
                    />
                </div>

                <div className={styles.formRow}>
                    <label htmlFor="verify" className={styles.label}>驗證碼：</label>
                    <input
                        type="text"
                        name="verify"
                        className={`${styles.input} ${styles.verifyInput}`}
                        value={code}
                        onChange={(e) => this.setState({ code: e.target.value })}
                    />
                    <button
                        className={styles.verifyBtn}
                        onClick={this.sendVerifyCode}
                        disabled={sending || cooldown > 0}
                    >
                        {cooldown > 0 ? `請稍候 (${cooldown}s)` : '發送驗證碼'}
                    </button>
                </div>

                <div className="text-center">
                    <button
                        className={styles.nextBtn}
                        onClick={this.checkVerifyCode}
                        disabled={verifying}
                    >
                        {verifying ? '驗證中...' : '下一步'}
                    </button>
                </div>

                {status && <p className={styles.status}>{status}</p>}

                {/* {expireDisplay && <p className="text-danger">{expireDisplay}</p>} */}
            </div>
        );
    }
}
export default StepEmail;