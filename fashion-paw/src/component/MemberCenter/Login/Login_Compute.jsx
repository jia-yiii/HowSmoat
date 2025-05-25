import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ThirdLogin from './Third_login';
import cookie from "js-cookie";
import axios from 'axios';
import styles from './Login_Compute.module.css'

class Login_Compute extends Component {
    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
        this.state = {
            show: false,
            stylelist: {
                minHeight: '550px',
                textAlign: 'center',
                marginTop: '100px',
                uid: ''
            }
        }
        this.logintest = this.logintest.bind(this);
    }
    logintest(event) {
        event.preventDefault();
        const email = this.email.current.value;  // 獲取 email 輸入框的值
        const password = this.password.current.value;  // 獲取 password 輸入框的值
        if (email === "" && password === "") {  // 比較兩個欄位是否為空
            alert("請輸入資料")
        } else if (email === "") {
            alert("請輸入帳號")
        } else if (password === "") {
            alert("請輸入密碼")
        } else {
            axios.get("http://localhost:8000/get/userinfo")
                .then(response => {
                    //response.data 是陣列，遍歷每一個使用者
                    const user = response.data.find(user => user.email === email);

                    if (user.password === password) {
                        // console.log(user);
                        // console.log(password);
                        
                        this.state.power = user.power


                        this.state.uid = user.uid
                        this.setState({})
                        console.log(this.state.uid);
                        console.log(this.state.power);
                        cookie.set('user_uid', user.uid, { expires: 1, SameSite: 'Lax' })
                        cookie.set('user_power', user.power, { expires: 1, SameSite: 'Lax' })
                        console.log('成功設置cookie', cookie.get('user_uid'));
                        console.log('成功設置cookie', cookie.get('user_power'));
                        this.updatatime()
                        // window.location.href = "/";

                    } else {
                        alert("email或密碼錯誤")
                    }
                })
                .catch(error => {
                    console.error('錯誤:', error);
                });
        }
    }


    updatatime=()=>{
        let uid = cookie.get("user_uid")
        axios.post(`http://localhost:8000/post/updatatime/${uid}`).then((response) => {
            console.log("建立成功:");
            
            window.location.href = "/"
        })
        .catch((error) => {
            console.error("更新失敗:", error);
        });




    }







    render() {
        let { show } = this.state
        return (
            <React.Fragment>
                <div className={styles.loginCard}>
                    <h1 className={styles.loginTitle}>登入</h1>
                    <form className={styles.loginForm} onSubmit={this.logintest}>
                        <label htmlFor="email" className={styles.textAP}>帳號：</label>
                        <input type="email" id="email" ref={this.email} className={styles.inputField} placeholder='請輸入Email帳號' />

                        <label htmlFor="password" className={styles.textAP}>密碼：</label>
                        <input type="password" id="password" ref={this.password} className={styles.inputField} placeholder='請填寫密碼' />

                        <input type="submit" value="登入" className={styles.submitButton} />
                    </form>
                    <div className={styles.forgetunregi}>
                        <a href="#" onClick={() => this.setState({ show: true })} className={styles.link}>忘記密碼</a>
                        <a href="/Register" className={styles.link}>註冊帳號</a>
                    </div>

                    <ThirdLogin />
                </div>

                {show && (
                    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '80vh' }}>
                            <div className="modal-content">


                                <div className="modal-body" style={{ overflowY: 'auto' }}>
                                    <label htmlFor="resetEmail">電子郵件</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="resetEmail"
                                        value={this.state.resetEmail}
                                        onChange={(e) => this.setState({ resetEmail: e.target.value })}
                                    />
                                    <p className="text-secondary mt-2">{this.state.resetStatus}</p>
                                </div>

                                <div className="modal-footer">
                                    {/* 傳送連結 */}
                                    <button
                                        className={styles.btnadd}
                                        onClick={async () => {
                                            const { resetEmail } = this.state;
                                            if (!resetEmail) {
                                                this.setState({ resetStatus: '請輸入 email' });
                                                return;
                                            }

                                            this.setState({ resetStatus: '請稍後，寄送驗證碼ing...' });

                                            try {
                                                const res = await fetch('http://localhost:8000/password/request-reset', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({ email: resetEmail })
                                                });

                                                const result = await res.json();
                                                if (result.success) {
                                                    this.setState({ resetStatus: '✅ 重設連結已寄出，請查看信箱' });
                                                } else {
                                                    this.setState({ resetStatus: '❌ ' + result.message });
                                                }
                                            } catch (err) {
                                                this.setState({ resetStatus: '❌ 發送失敗（伺服器錯誤）' });
                                            }
                                        }}
                                    >
                                        傳送連結
                                    </button>
                                    {/* 取消 */}
                                    <button type="button" className={styles.btncancel} onClick={() => {
                                        this.setState({
                                            show: false
                                        })
                                    }}>取消</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default Login_Compute;
