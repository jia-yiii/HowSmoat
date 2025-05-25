import React, { Component } from 'react';
import MainImg from './Login/Main_img';
import LoginCompute from './Login/Login_Compute';
import cookie from "js-cookie";
import styles from './Login.module.css'
class Login extends Component {
    render() {
        return (
            <div className={styles.fullScreenBackground}>
                <div className={styles.loginCardCenter}>
                    <LoginCompute />
                </div>
            </div>
        );
    }
}
//登入後session記憶username 使用者權限...

export default Login;