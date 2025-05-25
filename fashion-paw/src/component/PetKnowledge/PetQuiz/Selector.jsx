import React, { useState, useRef } from 'react';
import styles from './Quiz.module.css';

export default function PetSelector({ options, onChange }) {
  const [current, setCurrent] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const labelRef = useRef(null);

  const handleAnimation = (direction) => {
    const animClass = direction === 'left' ? styles.slideLeft : styles.slideRight;
    setAnimationClass(animClass);

    // 等待動畫結束後清除 class
    if (labelRef.current) {
      const node = labelRef.current;
      node.addEventListener('animationend', () => {
        setAnimationClass('');
      }, { once: true });
    }
  };

  const prev = () => {
    const nextIndex = (current - 1 + options.length) % options.length;
    handleAnimation('left');
    setCurrent(nextIndex);
    onChange(nextIndex);
  };

  const next = () => {
    const nextIndex = (current + 1) % options.length;
    handleAnimation('right');
    setCurrent(nextIndex);
    onChange(nextIndex);
  };

  return (
    <div className="p-4 text-center" style={{ width: 300, margin: '0 auto' }}>
      <h5 className="mb-5">請選擇動物</h5>
      <div className={styles.selectorControls}>
        <button
          onClick={prev}
          className={`${styles.triangleBtn} ${styles.triangleLeft}`}
          aria-label="上一隻"
        />
        <span
          ref={labelRef}
          className={`${styles.selectorLabel} ${animationClass}`}
        >
          {options[current]}
        </span>
        <button
          onClick={next}
          className={`${styles.triangleBtn} ${styles.triangleRight}`}
          aria-label="下一隻"
        />
      </div>
    </div>
  );
}
