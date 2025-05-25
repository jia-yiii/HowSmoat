import React, { Component } from 'react';
import styles from './AddToMyFavorite.module.css'
class AddToMyFavorite extends Component {

  render() {
    const { onClick, size, type, isFavorite } = this.props
    return (<>
      {/* <h1>這是收藏按鈕</h1> */}
      <button
        className={`btn rounded ptxtb2 ${styles.favBtn}`}
        onClick={onClick}
        style={{ fontSize: size, cursor: "pointer" }}>
        {/* 如果 type 是 text，顯示愛心 + 收藏文字 */}
        {type === "text" ? (
          <>
            {isFavorite ? (
              <i className={`bi bi-heart-fill ${styles.favClick}`}></i>
            ) : (
              <>
                <i className={`bi bi-heart ${styles.favOriginal}`}></i>
                <i className={`bi bi-heart-fill ${styles.favHover}`}></i>
              </>
            )}
            <span className={`ms-1 ${styles.favOriginal} `}>{isFavorite ? " 已收藏" : " 收藏"}</span>
            <span className={`ms-1 ${styles.favHover} `}>{isFavorite ? " 已收藏" : " 收藏"}</span>
          </>
        ) : (
          <>
            {isFavorite ? (
              <i className={`bi bi-heart-fill ${styles.favClick}`}></i>
            ) : (
              <>
                <i className={`bi bi-heart ${styles.favOriginal}`}></i>
                <i className={`bi bi-heart-fill ${styles.favHover}`}></i>
              </>
            )}
          </>
        )}

      </button>
    </>);
  }



}

export default AddToMyFavorite;