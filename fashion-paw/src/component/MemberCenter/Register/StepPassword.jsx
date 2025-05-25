import React, { Component } from 'react';
import styles from './StepPassword.module.css'
class StepPassword extends Component {
    constructor(props) {
        super(props)
        this.inputpassword = React.createRef();
        this.state = {
            password: "",
            cpwd: ""
        }
    }
    //密碼欄位input就更改state
    passwordinput = (event) => {
        let newState = { ...this.state }
        newState.password = event.target.value
        this.setState(newState)
    }
    cwdinput = (event) => {
        let newState = { ...this.state }
        newState.cpwd = event.target.value
        this.setState(newState)
    }
    //確認密碼是否與確認密碼相同
    PasswordComfirm = (event) => {
        event.preventDefault()
        let { password, cpwd } = this.state
        if (password === cpwd) {

            const inputpassword = this.inputpassword.current.value
            this.props.getpassword(inputpassword)

            this.props.next()
        }
        else
            alert('密碼與確認密碼不符!!!')
    }

    render() {
        return (
            <div className={styles.Wrapper}>
                <div className={styles.formRow}>
                    <label className={styles.label}>密碼：</label>
                    <input type='password' name="password" className={styles.input} onInput={this.passwordinput} ref={this.inputpassword} />
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>確認密碼：</label>
                    <input type='password' name="c_pwd" className={styles.input} onInput={this.cwdinput} />
                </div>
                <div className="text-center">
                    <button className={styles.nextBtn}
                        onClick={this.PasswordComfirm} >下一步
                    </button>
                </div>
            </div>
        );
    }
}

export default StepPassword;