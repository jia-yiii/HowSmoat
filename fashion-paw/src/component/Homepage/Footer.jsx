// src/component/Homepage/Footer.jsx
import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container-lg">
        <div className="row">
          {/* 第一欄 */}
          <div className="col-6 col-md-3 mb-4">
            <ul className={styles.list}>
              <li><a href="/Aboutus">關於我們</a></li>
              <li><a href="/Help">幫助中心</a></li>
            </ul>
          </div>
          {/* 第二欄 */}
          <div className="col-6 col-md-3 mb-4">
            <ul className={styles.list}>
              <li><a href="/ProductPage">拾毛百貨</a></li>
              <li><a href="/SeProductPage">拾毛市場</a></li>
              <li><a href="/faq">會員專區</a></li>
              <li><a href="/contact">購物車</a></li>
            </ul>
          </div>
          {/* 第三欄 */}
          <div className="col-6 col-md-3 mb-4">
            <ul className={styles.list}>
              <li><a href="/HealthCheck/dog">新手飼養指南</a></li>
              <li><a href="/Novicefeeding/dog">健康檢查篇</a></li>
              <li><a href="/PartTouch/Touch">部位有話說</a></li>
              <li><a href="/PetQuiz/Quiz">寵物知多少</a></li>
            </ul>
          </div>
          {/* 聯絡資訊 */}
          <div className="col-6 col-md-3 mb-4">
            <div className={styles.contact}>
              <p><strong>信箱：</strong>howsmoat@gmail.com</p>
              <p><strong>地址：</strong>408 臺中市南屯區公益路二段51號</p>
            </div>
          </div>
        </div>
        <div className="text-center small text-white mt-4">
          Copyright © 好拾毛 All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
