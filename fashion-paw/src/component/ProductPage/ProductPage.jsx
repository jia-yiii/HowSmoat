import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './ProductPage.module.css';
import cookie from 'js-cookie';

import FilterBar from './FilterBar/FilterBar';
import Sidebar from './SideBar/SideBar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import HotRanking from './HotRanking/HotRanking';

export default function ProductPage() {
  const user_id = cookie.get('user_uid');
  const location = useLocation();
  const searchState = location.state || {};
  const searchProducts = searchState.products;

  const [filters, setFilters] = useState({ functions: [], brands: [], price: '', hotRanking: '' });
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [displayItems, setDisplay] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filterKey, setFilterKey] = useState(1);
  // Sidebar 篩選 state
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    console.log(filters);

  }, [filters])

  // 讀取收藏
  useEffect(() => {
    async function fetchFav() {
      try {
        const res = await axios.get(`http://localhost:8000/select/collect/${user_id}/all`);
        setFavoriteIds(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (user_id) fetchFav();
  }, [user_id]);

  // 初始載入資料
  useEffect(() => {
    if (searchProducts) {
      // 有搜尋結果就直接用
      console.log(typeof (searchProducts[0].images));
      searchProducts.forEach(element => {
        element.images = JSON.parse(element.images)
      });
      console.log(typeof (searchProducts[0].images));
      setProducts(searchProducts);
    } else {
      // 從後端撈取最新商品
      axios.get('http://localhost:8000/get/new_product/home')
        .then(res => {
          const labelMap = {
            pet_food: '飼料',
            complementary_food: '副食',
            snacks: '零食',
            Health_Supplements: '保健食品',
            Living_Essentials: '生活家居',
            toys: '玩具'
          };

          const data = res.data.map(prod => {
            const key = prod.categories;
            return {
              ...prod,
              images: JSON.parse(prod.images),
              attributes_object: JSON.parse(prod.attributes_object),
              created_at: new Date(prod.created_at),
              categories_key: key,
              categories_label: labelMap[key] || key
            };
          });
          setProducts(data);
        })
        .catch(err => console.error('抓資料失敗:', err));
    }
  }, [location.state]);

  // 過濾、排序
  useEffect(() => {
    let items = [...products];

    // Sidebar 篩選
    if (typeFilter) items = items.filter(p => p.pet_type === typeFilter);
    if (categoryFilter) items = items.filter(p => p.categories_key === categoryFilter);

    // FilterBar 篩選
    const { functions: funcs, brands, price, hotRanking } = filters;
    if (funcs.length) items = items.filter(p => funcs.includes(p.categories_label));
    if (brands.length) items = items.filter(p => brands.includes(p.attributes_object.brand));

    // 價格
    if (price) {
      let min, max;

      if (price === '100以下') {
        // 只要 ≤100
        min = 0;
        max = 100;
      }
      else if (price.includes('+')) {
        // 例如 '1000+' → [1000, ∞]
        min = Number(price);
        max = Infinity;
      }
      else {
        // 區間 '101-300'
        [min, max] = price.split('-').map(Number);
      }

      items = items.filter(p => p.price >= min && p.price <= max);
    }
    if (hotRanking === 'hot_desc') items.sort((a, b) => b.hotranking - a.hotranking);
    if (hotRanking === 'hot_asc') items.sort((a, b) => a.hotranking - b.hotranking);

    // 最終排序
    if (sortBy === 'price_asc') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') items.sort((a, b) => b.price - a.price);
    if (sortBy === 'createdAt') items.sort((a, b) => b.created_at - a.created_at);

    setDisplay(items);
  }, [products, filters, sortBy, typeFilter, categoryFilter]);

  const toggleFav = id => {
    if (!user_id) return alert('請先登入!!!');
    const url = favoriteIds.includes(id)
      ? `http://localhost:8000/delete/collect/${user_id}/${id}`
      : `http://localhost:8000/insert/collect/${user_id}/${id}`;
    axios.get(url).catch(err => console.error(err));
    setFavoriteIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const addCart = id => console.log('Add to cart', id);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContent}>
        <div className={styles.filterBar}>
          <FilterBar key={filterKey} onFilterChange={setFilters} />
        </div>
        <div className={styles.topBar}>
          <SortBar onSortChange={setSortBy} />
          <SwitchBtn viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <Sidebar onSelectCategory={(type, cat) => {
              setTypeFilter(type);
              setCategoryFilter(cat);
            }} />
          </aside>
          <section className={styles.main}>
            <ProductList
              products={displayItems}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFav}
              onAddToCart={addCart}
              viewMode={viewMode}
            />
          </section>
        </div>
      </div>
      <div className={styles.rankingSection}>
        <HotRanking />
      </div>
    </div>
  );
}
