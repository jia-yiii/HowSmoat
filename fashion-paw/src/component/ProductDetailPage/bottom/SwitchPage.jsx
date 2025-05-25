import React, { Component } from 'react';
import styles from './SwitchPage.module.css'
class SwitchPage extends Component {

    render() {
        const { condition, changePage, currentPage } = this.props
        return (
            <div className={styles.btnarea}>
                {/* <h1>switch</h1> */}
                <div className='d-flex'>
                    <div className={`flex-fill ${styles.switchbtn} ${currentPage === "description" ? styles.btnClickingdesc : ""}`}
                        onClick={() => changePage("description")}>商品說明
                    </div>
                    <div className={`flex-fill ${styles.switchbtn} ${currentPage === "seller" ? styles.btnClickingseller : ""}`}
                        onClick={() => changePage("seller")}>{condition === "new" ? "商品評論" : "賣家資訊"}
                    </div>

                </div>


            </div>

        );
    }
}

export default SwitchPage;