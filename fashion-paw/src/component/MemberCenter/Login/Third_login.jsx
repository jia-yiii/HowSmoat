import React, { Component } from 'react';
import styles from './Third_login.module.css'
class Third_Login extends Component {
    state = {
        stylelist: {
            display: 'flex',
            justifyContent: 'space-evenly',
        }
    }
    render() {
        return (
            <div className={styles.thirdlogin}>
                <div className={styles.thirdtitle}>第三方登入</div>
                <div className={styles.thirdbtnGroup}>
                    <a className={styles.thirdIcon} href='https://744a-118-163-218-100.ngrok-free.app/auth/google/'><img src="/media/icon/Googlelogin.png" alt="Google login" className={styles.iconImg} /></a>
                    <a className={styles.thirdIcon} href='https://744a-118-163-218-100.ngrok-free.app/auth/line/'><img src="/media/icon/LINElogin.png" alt="FB login" className={styles.iconImg} /></a>
                </div>
            </div>
        );
    }
}

export default Third_Login;