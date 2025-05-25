// CategoryIcons.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryIcons.module.css';
import PetFood from './images/PetFood.png'
import ComplementaryFood from './images/ComplementaryFood.png'
import Snacks from './images/ComplementaryFood.png'
import HealthSupplements from './images/HealthSupplements.png'
import LivingEssentials from './images/LivingEssentials.png'
import Toys from './images/Toys.png'

// 分類項目陣列，可替換為動態資料
const categories = [
  { label: '飼料', icon: PetFood, to: '/products/feed' },
  { label: '副食', icon: ComplementaryFood, to: '/products/snack' },
  { label: '零食', icon: Snacks, to: '/products/snack' },
  { label: '保健食品', icon: HealthSupplements, to: '/products/health' },
  { label: '生活家居', icon: LivingEssentials, to: '/products/home' },
  { label: '玩具', icon: Toys, to: '/products/toy' },
];

function CategoryIcons() {
  return (
    <div className='container-lg'>
      <div className={styles.wrapper}>
        {categories.map((cat) => (
          <Link key={cat.label} to={cat.to} className={styles.item}>
            <img src={cat.icon} alt={cat.label} className={styles.icon} />
            <span className={styles.label}>{cat.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryIcons;