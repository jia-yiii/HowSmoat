import React from 'react';
import styles from './SortBar.module.css';

export default function SortBar({ onSortChange }) {
  return (
    <div className={styles.row}>
      <label className={styles.label}>排序: </label>
      <select
        className={styles.select}
        onChange={e => onSortChange(e.target.value)}
      >
        <option value="">— 選擇 —</option>
        <option value="price_asc"> 依價格排序：低至高</option>
        <option value="price_desc">依價格排序：高至低</option>
        <option value="createdAt">依最新項目排序</option>
      </select>
    </div>
  );
}
