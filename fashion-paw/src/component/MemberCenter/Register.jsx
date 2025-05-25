import React, { Component } from 'react';
import MainImg from './Login/Main_img';
import RegisterCompute from './Register/Register_Compute';
import styles from './Register.module.css'
class Register extends Component {
    state = {}
    render() {
        return (
            <div className={styles.fullScreenBackground}>
                <div className={styles.RegisterCardCenter}>
                    {/* RegisterCompute為三步驟表單的所有內容  */}
                    <RegisterCompute />
                </div>
            </div>
        );
    }
}

export default Register;