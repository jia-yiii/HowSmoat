import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

export default function ProductList({
  products = [],
  favoriteIds = [],
  onToggleFavorite,
  onAddToCart,
  viewMode = 'grid',           // 先接收 viewMode
}) {
  // 根據 viewMode 動態套用 .grid 或 .list
  const containerCls = `${styles.container} ${viewMode === 'grid' ? styles.grid : styles.list
    }`;
  console.log(favoriteIds);
  return (
    <ul className={containerCls}>
      {
        products.map(p => (
          <li key={p.id} className={styles.item}>
            <ProductCard
              {...p}
              isFavorite={favoriteIds.includes(p.id)}
              onToggleFavorite={() => onToggleFavorite(p.id)}
              onAddToCart={() => onAddToCart(p.id)}
              viewMode={viewMode}       // 再把 viewMode 傳給卡片
            />
          </li>
        ))}
    </ul>
  );
}
