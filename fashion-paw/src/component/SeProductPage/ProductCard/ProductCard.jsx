// src/component/ProductCard/ProductCard.jsx
import React, { useEffect } from 'react';
import styles from './ProductCard.module.css';
import { Link } from 'react-router-dom';
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';

// 占位图，请把这张图放到 public 目录下，或者改成你项目里能访问到的默认图
const PLACEHOLDER = '/placeholder.png';

export default function ProductCard(props) {
  const {
    id,
    uid,
    name,
    price,
    images,               // 可能是 undefined / null / array
    isFavorite,
    onToggleFavorite,
    onAddToCart,
    viewMode
  } = props;

  // 1. 安全地处理 images，保证是一个数组
  const safeImages = Array.isArray(images) ? images : [];
  {
    console.log(safeImages);
    console.log(images);

  }

  // 2. 取第一张，如果没有就用占位图
  const firstImg = safeImages.length > 0 && safeImages[0].img_path
    ? safeImages[0].img_path
    : PLACEHOLDER;

  const cls = viewMode === 'list'
    ? `${styles.card} ${styles.horizontal}`
    : styles.card;

  const product = {
    pid: id,
    pd_name: name,
    price,
    image: firstImg,
    images:safeImages,
    condition: 'second',
    uid: String(uid),
  };
 console.log("🛒 準備加入購物車的 product：", product)
  return (
    <div className={cls}>
      <div className={styles.imageWrapper}>
        <Link to={`/product/${id}`}>
          <img
            src={firstImg}
            alt={name}
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.price}>NT${price}</p>
      </div>
      <div className={styles.actions}>
        <AddToMyFavorite
          isFavorite={isFavorite}
          onClick={() => onToggleFavorite(id)}
          aria-label="切換收藏"
        />
       
        <AddToCartBtn
          type="icon"
          product={product}
          quantity={1}
          aria-label="加入購物車"
        />
      </div>
    </div>
  );
}
