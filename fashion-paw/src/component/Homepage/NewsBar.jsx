import React from 'react';
import styles from './NewsBar.module.css';
import { BsBellFill } from 'react-icons/bs';

const messages = [
  '結帳金額滿399免運費',
  '貓抓板買二送一',
  '全館玩具8折',
  '新會員註冊送100元折價券',
  '保健食品買三送一',
];
// 點擊跳轉到 NewsEvent 區塊
const handleClick = () => {
  const target = document.querySelector('#newsEvents');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

function NewsBar() {
   // 將訊息合併成一串
  const combined = messages.join('　‧　');
  return (
    <div className={styles.newsBar}  onClick={handleClick}>
      <BsBellFill className={styles.icon} />
      <div className={styles.trackWrapper}>
        <div className={styles.track}>
          <span>{combined}</span>
          <span aria-hidden="true">{combined}</span>
        </div>
      </div>
    </div>
  );
}

export default NewsBar;
