// 這是購物車跟結帳頁面的確認按鈕

import React, { Component } from 'react';
import styles from './ConfirmBtn.module.css'
class ConfirmBtn extends Component {
    render() {
        const { onClick, type } = this.props
        return (<>
            <div className='px-4 my-2'>
                <button
                    className={styles.ConfirmBtn}
                    onClick={onClick}
                    type="button"
                >
                    {type === "toPayPage" ? "前往結帳" : "確認付款"}
                </button>
            </div>

        </>);
    }
}

export default ConfirmBtn;