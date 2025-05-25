// src/component/share/BreadCrumbs.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BreadCrumbs.module.css';
import CheckBillPage from 'component/CheckBill/CheckBillPage';

const nameMap = {
  '': '首頁',
  products: '商品列表',
  'second-products': '二手商品',
  cart: '購物車',
  article: '文章區',
  about: '關於我們',
  MemberCenter: '會員中心',
  profile: '個人資料',
  orders: '購物紀錄',
  'credit-card': '信用卡',
  mycollect: '我的收藏',
  mycoupon: '我的優惠券',
  myAddress: '我的地址',
  'Content-manage': '後台管理',
  'manage-market': '管理賣場',
  New_Products: '新品管理',
  Second_Products: '二手商品管理',
  User: '使用者管理',
  Article: '文章管理',
  Aboutus: '關於我們',
  Help: '幫助中心',
  Novicefeeding: '新手飼養指南',
  dog: '狗',
  cat: '貓',
  mouse: '倉鼠',
  bird: '鳥',
  HealthCheck: '健康檢查',
  Login: '登入',
  Register: '註冊',
  PartTouch: '互動小專區',
  Touch: '部位有話說',
  PetQuiz: '互動小專區',
  Quiz: '寵物小測驗',
  ProductPage: '拾毛百貨',
  SeProductPage: '拾毛市場',
  ShoppingCartPage: '購物車',
  CheckBillPage:'填寫付款資料'
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const lastSeg = segments[segments.length - 1] || '';

  const [itemName, setItemName] = useState('');
  const knowledgeRoutes = ['Novicefeeding', 'HealthCheck'];

  useEffect(() => {
    if (/^\d+$/.test(lastSeg)) {
      // 根據第一段路由決定抓文章 or 抓商品
      if (knowledgeRoutes.includes(segments[0])) {
        // 單篇文章：抓文章標題
        fetch(`/api/articles/${lastSeg}`)
          .then(res => res.json())
          .then(data => setItemName(data.title || '文章'))
          .catch(() => setItemName('文章'));
      } else {
        // 商品細節：抓商品名稱
        fetch(`http://localhost:8000/productslist/${lastSeg}`)
          .then(res => res.json())
          .then(data => setItemName(data.pd_name || '商品'))
          .catch(() => setItemName('商品'));
      }
    } else {
      setItemName('');
    }
  }, [lastSeg, segments]);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbContainer}>
      <ol className={styles.breadcrumb}>
        <li className={styles.breadcrumbItem}>
          <Link to="/" className={styles.link}>{nameMap['']}</Link>
        </li>

        {segments.map((seg, i) => {
          const to = '/' + segments.slice(0, i + 1).join('/');
          const isLast = i === segments.length - 1;
          const isNum = /^\d+$/.test(seg);

          const label = isLast && isNum
            ? (itemName || '載入中…')
            : (nameMap[seg] || seg);

          return (
            <React.Fragment key={to}>
              <li className={styles.separator}>›</li>
              <li
                className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''}`}
                {...(isLast ? { 'aria-current': 'page' } : {})}
              >
                {isLast
                  ? label
                  : <Link to={to} className={styles.link}>{label}</Link>
                }
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
