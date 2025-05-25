import React from 'react';
import styles from './SortBar.module.css';

export default function SortBar({ onSortChange }) {
  return (
    <div className={styles.row}>
      <label className={styles.label}>排序:</label>
      <select
        className={styles.select}
        onChange={e => onSortChange(e.target.value)}
      >
        <option value="">— 選擇 —</option>
        <option value="price_asc">價格：低→高</option>
        <option value="price_desc">價格：高→低</option>
        <option value="createdAt">上架日期</option>
      </select>
    </div>
  );
}
