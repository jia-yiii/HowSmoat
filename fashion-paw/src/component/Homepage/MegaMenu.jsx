// src/component/Homepage/MainNav/MegaMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
// import { NavLink } from 'react-router-dom';  // 如果要讓卡片可點進詳細頁的話
import navstyles from './MainNav.module.css';
import axios from 'axios';

export default function MegaMenu({
    pageKey,        // '/ProductPage' 或 '/SeProductPage'
    openKey,        // MainNav 傳進來：目前 hover 到哪一組
    selectedPet,    // MainNav state：左側選哪隻
    activeTab,      // MainNav state：右側選哪個 tab
    onPetChange,    // 切換左側 pet 時回呼
    onTabChange     // 切換右側 tab 時回呼
}) {
    const hasInit = useRef(false);
    // ── 先把所有靜態常數都放最上面 ──
    // 1) 後端 categories key → 中文
    const categoryNames = {
        pet_food: '飼料',
        complementary_food: '副食',
        snacks: '零食',
        Health_Supplements: '保健品',
        Living_Essentials: '生活家居',
        toys: '玩具',
    };

    // 2) tabs 中文排序
    const desiredTabOrder = [
        '飼料', '副食', '零食', '保健品', '生活家居', '玩具'
    ];

    // 3) 後端 pet_type key → 中文
    const petNames = {
        dog: '狗狗',
        cat: '貓咪',
        mouse: '倉鼠',
        bird: '鳥'
    };

    // 4) sidebar 寵物 key 排序 (原始 key 的順序)
    const desiredPetOrder = ['dog', 'cat', 'mouse', 'bird'];


    // ── 接著是 component state ──
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // ── 核心：當 hover 到自己這個 panel，才去撈指定幾個 pid ──
    useEffect(() => {
        if (openKey !== pageKey) return;

        // 這裡自己決定要排入哪幾個 pid
        const featuredPIDs = pageKey === '/ProductPage'
            ? ['1', '2', '10', '11', '12', '13', '18', '20', '30', '31', '42', '45', '46', '48', '61', '62', '67', '68', '74', '75', '81', '82', '83', '87', '88', '89', '92', '93', '98', '102', '103', '108', '109', '115', '116', '123', '124', '125']
            : ['151', '153', '159', '160', '133', '134', '145', '146'];

        setLoading(true);
        Promise.all(
            featuredPIDs.map(pid =>
                axios
                    .get(`http://localhost:8000/productslist/${pid}`)
                    .then(res => res.data)
            )
        ).then(products => {
            // 把所有 distinct 的 pet_type、categories 抽出來
            let pets = Array.from(new Set(products.map(p => p.pet_type)));
            let tabs = Array.from(new Set(products.map(p => p.categories)));

            // 依 desiredPetOrder 排序並過濾
            pets = pets
                .filter(p => desiredPetOrder.includes(p))
                .sort((a, b) =>
                    desiredPetOrder.indexOf(a) - desiredPetOrder.indexOf(b)
                );

            // 依中文名稱、再按照 desiredTabOrder 排序
            tabs = tabs
                .filter(key => categoryNames[key])
                .sort((a, b) => {
                    const nameA = categoryNames[a];
                    const nameB = categoryNames[b];
                    return desiredTabOrder.indexOf(nameA)
                        - desiredTabOrder.indexOf(nameB);
                });

            // 建立二維 content[pet][tab] = [{img,title},...]
            const content = {};
            pets.forEach(pet => {
                content[pet] = {};
                tabs.forEach(tabKey => {
                    content[pet][tabKey] = products
                        .filter(x => x.pet_type === pet && x.categories === tabKey)
                        .map(x => ({
                            img: x.images?.[0]?.img_path
                                || '/media/default/no-image.png',
                            title: x.pd_name,
                            pid: x.pid,                   // <-- 如果之後要做 NavLink，用它就行
                        }));
                });
            });

            setData({ sidebar: pets, tabs, content });
            // 初始化第一筆
            if (!hasInit.current) {
                onPetChange(pets[0]);
                onTabChange(tabs[0]);
                hasInit.current = true;
            }
        })
            .catch(err => {
                console.error('MegaMenu 載入失敗', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [openKey, pageKey]);


    // ── guard & render ──
    if (openKey !== pageKey) return null;
    if (loading) return <div className={navstyles.megaPanel}>載入中…</div>;
    if (error) return <div className={navstyles.megaPanel} style={{ color: 'red' }}>錯誤：{error}</div>;
    if (!data) return null;

    return (
        <div className={navstyles.megaPanel}>
            {/* 左側 sidebar */}
            <aside className={navstyles.sidebar}>
                <ul>
                    {data.sidebar.map(petKey => (
                        <li key={petKey}>
                            <button
                                className={
                                    `${navstyles.sidebarLink} ` +
                                    `${petKey === selectedPet ? navstyles.activePet : ''}`}
                                onClick={() => onPetChange(petKey)}
                            >
                                {petNames[petKey] || petKey}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* 右側 tabs + content */}
            <section className={navstyles.content}>
                {/* 如果是拾毛百貨，顯示分類 tabs */}
                <div className={navstyles.tabs}>
                    {pageKey === '/SeProductPage' ? (
                        <button className={`${navstyles.tab} ${navstyles.activeTab}`} disabled>
                            商品總覽
                        </button>
                    ) : (
                        data.tabs.map(tabKey => (
                            <button
                                key={tabKey}
                                className={`${navstyles.tab} ${tabKey === activeTab ? navstyles.activeTab : ''}`}
                                onClick={() => onTabChange(tabKey)}
                            >
                                {categoryNames[tabKey] || tabKey}
                            </button>
                        ))
                    )}
                </div>

                <div className={navstyles.tabPane}>
  {(() => {
    const items =
      pageKey === '/SeProductPage'
        ? Object.values(data.content[selectedPet] || {}).flat()
        : data.content[selectedPet]?.[activeTab] || [];

    if (items.length === 0) {
      return <p className={navstyles.emptyMsg}>暫無商品</p>;
    }

    return items.map(item => (
      <a
        key={item.pid}
        className={navstyles.card}
        href={`http://localhost:3000/product/${item.pid}`}
      >
        <img src={item.img} alt={item.title} />
        <p>{item.title}</p>
      </a>
    ));
  })()}
</div>

            </section>

        </div>
    );
}
