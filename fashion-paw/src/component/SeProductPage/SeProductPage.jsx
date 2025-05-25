// src/component/ProductPage/SeProductPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from './SeProductPage.module.css';
import { useLocation } from 'react-router-dom';

import SideBar from './SideBar/SideBar';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import cookie from 'js-cookie';
import axios from 'axios';

export default function SeProductPage() {
  const location = useLocation();
  const searchState = location.state || {};
  const SearchProducts = searchState.products;
  const user_id = cookie.get('user_uid');

  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ functions: [], price: '', locations: [], depreciation: 0 });
  const [filterKey, setFilterKey] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cityTownArray, setCityTownArray] = useState([]);
  const [mapSelectTown, setMapSelectTown] = useState(null);

  // 讀取搜尋結果或後端資料
  useEffect(() => {
    const fetchData = async () => {
      if (SearchProducts) {
        console.log(typeof (SearchProducts[0].images));
        SearchProducts.forEach(element => {
          element.images = JSON.parse(element.images)
        });
        console.log(typeof (SearchProducts[0].images));

        // 1. 有搜尋結果：直接塞入
        setProducts(SearchProducts);
        setCityTownArray(SearchProducts.map(pd => pd.city + pd.district));
      } else {
        try {
          const res = await axios.get('http://localhost:8000/get/second_product/home');
          console.log('raw data =>', res.data);
          const labelMap = {
            pet_food: '乾糧',
            complementary_food: '副食',
            snacks: '零食',
            Health_Supplements: '保健食品',
            Living_Essentials: '家居',
            toys: '玩具'
          };
          const data = res.data.map(prod => {
            // 保留原始 key
            const key = prod.categories;
            // 安全解析 JSON
            let imgs = [];
            try { imgs = JSON.parse(prod.images); }
            catch (e) { console.error('parse images 失敗', prod.images, e); }
            let attrs = {};
            try { attrs = JSON.parse(prod.attributes_object); }
            catch (e) { console.error('parse attributes_object 失敗', prod.attributes_object, e); }

            return {
              ...prod,
              images: imgs,
              attributes_object: attrs,
              new_level: parseInt(prod.new_level, 10),
              created_at: new Date(prod.created_at),
              city: prod.city.replace(/台/g, '臺'),
              city_town: prod.city.replace(/台/g, '臺') + prod.district,
              categories_key: key,
              categories_label: labelMap[key] || '其他'
            };
          });
          setProducts(data);
          setCityTownArray(data.map(pd => pd.city_town));
        } catch (err) {
          console.error('抓資料失敗:', err);
        }
      }
    };
    fetchData();
  }, [location.state]);

  // 載入收藏清單
  useEffect(() => {
    async function fetchFav() {
      if (!user_id) return;
      try {
        const res = await axios.get(`http://localhost:8000/select/collect/${user_id}/all`);
        setFavoriteIds(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchFav();
  }, [user_id]);

  // 過濾 + 排序
  useEffect(() => {
    let result = [...products];
    const { functions = [], price = '', locations = [], depreciation = 0 } = filters;

    // 類型與分類
    if (selectedType) result = result.filter(p => p.pet_type === selectedType);
    if (selectedCategory) result = result.filter(p => p.categories_key === selectedCategory);

    // 價格
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // 地區
    if (mapSelectTown) result = result.filter(p => p.city_town === mapSelectTown);

    // 功能
    if (functions.length) result = result.filter(p => functions.includes(p.function));
    // 地址
    if (locations.length) result = result.filter(p => locations.includes(p.city));
    // 折舊
    if (depreciation) result = result.filter(p => p.new_level === depreciation);

    // 排序
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'createdAt') result.sort((a, b) => b.created_at - a.created_at);
    else if (sortBy === 'hotranking') result.sort((a, b) => b.hotranking - a.hotranking);

    setFiltered(result);
  }, [products, filters, sortBy, selectedType, selectedCategory, mapSelectTown]);

  const handleFilterChange = useCallback(nf => setFilters(nf), []);
  const handleSortChange = sk => setSortBy(sk);
  const handleToggleFavorite = id => {
    if (!user_id) return alert('請先登入!!!');
    const url = favoriteIds.includes(id)
      ? `http://localhost:8000/delete/collect/${user_id}/${id}`
      : `http://localhost:8000/insert/collect/${user_id}/${id}`;
    axios.get(url).catch(e => console.error(e));
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const handleAddToCart = id => console.log('Add to cart', id);
  const handleSelectCategory = (type, cat) => {
    setSelectedType(type);
    setSelectedCategory(cat);
  };
  const clearFilters = () => {
    setFilterKey(k => k + 1);
    setMapSelectTown(null);
    setSelectedType(null);
    setSelectedCategory(null);
  };

  const uniqueLocations = Array.from(new Set(products.map(p => p.city)));
  const handleTownSelect = town => setMapSelectTown(town);

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <FilterBar
          key={filterKey}
          city_town={cityTownArray}
          locations={uniqueLocations}
          onFilterChange={handleFilterChange}
          SortProductbyTown={handleTownSelect}
        />
      </div>

      <main className={styles.main}>
        <span>{mapSelectTown}</span>
        <div className={styles.topBar}>
          <SortBar onSortChange={handleSortChange} />
          <SwitchBtn viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        <div className={styles.mix}>
          <aside className={styles.sidebar}>
            <SideBar
              selectedType={selectedType}
              onSelectCategory={handleSelectCategory}
            />
          </aside>
          <div className={styles.productWrapper}>
            <ProductList
              products={filtered}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
              viewMode={viewMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
