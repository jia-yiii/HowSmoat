// src/components/Pagination.jsx
import React from 'react';
import styles from './Pagination.module.css';

export default function Pagination({
  page,         // 當前頁
  totalPages,   // 總頁數
  onPageChange  // (newPage: number) => void
}) {
  const toFirst = () => onPageChange(1);
  const toPrev  = () => onPageChange(Math.max(1, page - 1));
  const toNext  = () => onPageChange(Math.min(totalPages, page + 1));
  const toLast  = () => onPageChange(totalPages);

  return (
    <div className={styles.pagination}>
      <div className={styles.buttons}>
        <button onClick={toFirst} disabled={page === 1}>«</button>
        <button onClick={toPrev}  disabled={page === 1}>‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            className={n === page ? styles.active : ''}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}
        <button onClick={toNext} disabled={page === totalPages}>›</button>
        <button onClick={toLast} disabled={page === totalPages}>»</button>
      </div>
      <div className={styles.info}>
        第 {page} 頁 ｜ 共 {totalPages} 頁
      </div>
    </div>
  );
}
