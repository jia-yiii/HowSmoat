// src/component/SeProductPage/SideBar/SideBar.jsx
import React from 'react';
import styles from './SideBar.module.css';

const types = ['dog', 'cat', 'bird', 'mouse'];
const labels = {
  dog:   '狗狗專區',
  cat:   '貓貓專區',
  bird:  '鳥類專區',
  mouse: '倉鼠專區'
};

export default function Sidebar({ onSelectCategory = () => {}, selectedType }) {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {types.map(type => (
          <li key={type}>
            <button
              className={`${styles.itemBtn} ${selectedType === type ? styles.active : ''}`}
              onClick={() => onSelectCategory(type)}
            >
              {labels[type]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}