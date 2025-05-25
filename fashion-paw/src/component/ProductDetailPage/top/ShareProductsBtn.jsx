import React, { Component } from 'react';
import styles from './ShareProductsBtn.module.css';

class ShareProducts extends Component {


  render() {
    const {onClick, isShare}=this.props
    return (
      <>
        {/* <h1>這是分享按鈕</h1> */}
        <div className={styles.share}>
        <button
          className={`btn rounded ptxtb2 ${styles.shareBtn}`}
          onClick={onClick}
        >
          <i className={`bi bi-share ${styles.shareOriginal}`}></i>
          <i className={`bi bi-share-fill ${styles.shareHover}`}></i>
        </button>

        {/* 複製完成 */}
        {isShare && (
          <div className={`rounded ptxt5 p-2 ${styles.toast}`}>
            已複製網址 ✅
          </div>
        )}
        </div>
      </>
    );
  }
  
}

export default ShareProducts;