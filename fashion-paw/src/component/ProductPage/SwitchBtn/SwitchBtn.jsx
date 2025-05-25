import React from 'react';
import styles from './SwitchBtn.module.css';

export default function SwitchBtn({ viewMode, onViewChange }) {
  return (
    <div className={styles.switchBtn}>
      <button
        className={`${styles.btn} ${viewMode === 'grid' ? styles.active : ''}`}
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
      >
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" />
          <rect x="3" y="13" width="8" height="8" />
          <rect x="13" y="13" width="8" height="8" />
        </svg>
      </button>

      <button
        className={`${styles.btn} ${viewMode === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
      >
        <svg viewBox="0 0 24 24">
          <rect x="4" y="5" width="16" height="2" />
          <rect x="4" y="11" width="16" height="2" />
          <rect x="4" y="17" width="16" height="2" />
        </svg>
      </button>
    </div>
  );
}
