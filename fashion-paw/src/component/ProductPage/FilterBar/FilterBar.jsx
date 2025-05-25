// src/component/ProductPage/FilterBar/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FilterBar.module.css';

const functions = ['乾糧', '副食', '零食', '保健食品', '玩具', '生活家居'];
let brands = ['AAAA', 'BBBB', 'CCCC'];
const prices = [
  { value: '100以下', label: '100以下' },
  { value: '101-300', label: '101–300' },
  { value: '301-600', label: '301–600' },
  { value: '601-999', label: '601–999' },
  { value: '1000+', label: '1000以上' }
];

export default function FilterBar({
  petType = '',                  // 新增：當前寵物類型
  onFilterChange = () => { }
}) {
  const [selFuncs, setSelFuncs] = useState([]);
  const [selBrands, setSelBrands] = useState([]);
  const [selPrice, setSelPrice] = useState('');
  const [filterkey, setFilterKey] = useState(1)

  const [brandstate, setbrandstate] = useState(false);


  useEffect(() => {
    console.log(selFuncs);

    const fetchBrand = async () => {
      try {
        const res = await axios.get('http://localhost:8000/get/new_product/brand');
        console.log(res.data);
        let array = []
        res.data.forEach((br, idx) => {
          array[idx] = br.brand
        })
        brands = array
      } catch (err) {
        console.error('抓資料失敗:', err);
      }
    };
    fetchBrand();

  }, [])
  // 每次狀態改變就通知父元件
  useEffect(() => {
    onFilterChange({
      petType,                   // 把寵物類型也帶出去
      functions: selFuncs,
      brands: selBrands,
      price: selPrice
    });
  }, [petType, selFuncs, selBrands, selPrice]);

  const toggleArray = (arr, setFn, val) => {
    setFn(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const brandclose = (e) => {
    setbrandstate(prev => !prev)
    console.log(brandstate);

  }
  return (
    <div className={styles.filterBar}>
      {/* 第一行：功能 */}
      <div className={styles.row}>
        <span className={styles.label}>功能</span>
        <div className={styles.options}>
          {functions.map(f => (
            <label key={f}>
              <input
                type="checkbox"
                checked={selFuncs.includes(f)}
                onChange={() => toggleArray(selFuncs, setSelFuncs, f)}
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      {/* 第二行：品牌 */}
      <div className={styles.row}>
        <span className={styles.label}>品牌</span>
        <div className={styles.options}>

          {
            brandstate ? (
              brands.map(b => (
                <label key={b}>
                  <input
                    type="checkbox"
                    checked={selBrands.includes(b)}
                    onChange={() => toggleArray(selBrands, setSelBrands, b)}
                  />
                  {b}
                </label>
              ))
            ) : (
              brands.map((b, idx) => (
                (idx < 7)
                  ? (
                    <label key={b}>
                      <input
                        type="checkbox"
                        checked={selBrands.includes(b)}
                        onChange={() => toggleArray(selBrands, setSelBrands, b)}
                      />
                      {b}
                    </label>
                  )
                  : <div></div>
              ))
            )

          }
        </div>
        <span htmlFor="" className='btn' onClick={brandclose}>
          {
            brandstate
              ? <i class={`bi bi-caret-up-square ${styles.btnud}`}></i>
              : <i class={`bi bi-caret-down-square ${styles.btnud}`}></i>
          }
        </span>
      </div>

      {/* 第三行：價格 */}
      <div className={styles.row}>
        <span className={styles.label}>價格</span>
        <div className={styles.options}>
          {prices.map(p => (
            <label key={p.value}>
              <input
                type="radio"
                name="price"
                value={p.value}
                checked={selPrice === p.value}
                onChange={() => setSelPrice(p.value)}
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.clearBtn} onClick={() => {
          setSelFuncs([]);
          setSelBrands([]);
          setSelPrice('');
        }}>
          清除篩選
        </button>
      </div>
    </div >

  );
}
