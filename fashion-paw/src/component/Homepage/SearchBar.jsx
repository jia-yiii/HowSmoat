// SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';
import { ReactComponent as SearchIcon } from './images/search.svg';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const categories = ['新品', '二手'];


function SearchBar({ onSearch }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  // 目前選到哪個分類，預設就是第一個
  const [category, setCategory] = useState(categories[0]);
  // 使用者打的關鍵字
  const [keyword, setKeyword] = useState('');
  const history = useHistory()
  const wrapperRef = useRef();

  // 當 open 變為 true 時，自動聚焦到 input
  useEffect(() => {
    if (open) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSubmit = async (e) => {
    if (e)
      e.preventDefault();
    if (!keyword.trim()) return;
    if (category === '新品') {
      let search_result = await axios.post('http://localhost:8000/post/productsreach/new', { keyword: keyword })
      console.log(search_result.data.length);
      if (search_result.data.length) {
        history.push({
          pathname: '/ProductPage',
          state: {
            products: search_result.data,
          }
        });

      }
      else {
        alert('查無商品')
      }
    }
    else {
      let search_result = await axios.post('http://localhost:8000/post/productsreach/second', { keyword: keyword })
      console.log(search_result.data.length);
      if (search_result.data.length) {
        history.push({
          pathname: '/SeProductPage',
          state: {
            products: search_result.data,
          }
        });

      }
      else {
        alert('查無商品')
      }
    }
    // 2) 如果有輸入關鍵字，就跑 alert（或呼叫 onSearch）
    // alert(`你搜尋了：${keyword}（分類：${category}）`);
  };
  return (
    <form className={styles.wrapper}
      ref={wrapperRef}
      onSubmit={handleSubmit}
    >

      {open && (
        <>
          <select
            className={styles.select}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="搜尋商品…"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </>
      )}
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          if (!open) {
            setOpen(true);
          } else if (!keyword.trim()) {
            setOpen(false); // 如果已打開但沒輸入文字，再次點按鈕會收起來
          } else {
            handleSubmit(); // 若有輸入文字，才進行 submit
          }
        }}
        aria-label={open ? 'Submit search' : 'Toggle search'}
      >
        <SearchIcon className={styles.svgIcon} />
      </button>
    </form>
  );
}
export default SearchBar;
