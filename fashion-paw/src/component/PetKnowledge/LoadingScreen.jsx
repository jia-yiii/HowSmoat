import React from 'react';
import styles from './LoadingScreen.module.css';
import paw from './images/pawicon.svg'; // 你可換成任何可愛小圖

function LoadingScreen() {
  return (
    <div className={styles.loadingWrapper}>
      <img src={paw} alt="Loading..." className={styles.loadingIcon} />
      <p>正在呼叫毛毛夥伴...</p>
    </div>
  );
}

export default LoadingScreen;
