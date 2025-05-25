import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import navstyles from './MainNav.module.css';
import MegaMenu from './MegaMenu';

export default function MainNav() {
  const [openKey, setOpenKey] = useState(null);
  const [petByKey, setPetByKey] = useState({});
  const [tabByKey, setTabByKey] = useState({});
  const [openIndex, setOpenIndex] = useState(null);

  // 控制手風琴展開／收起
  const handleClick = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const pageNames = {
    '/ProductPage': '拾毛新品百貨',
    '/SeProductPage': '拾毛二手市場'
  };

  const paths = Object.keys(pageNames);

  // 這個就是手風琴要用的資料
  const items = [
    {
      label: '關於好拾毛',
      submenu: [
        { label: '關於我們', to: '/Aboutus' },
        { label: '幫助中心', to: '/Help' }
      ]
    },
    {
      label: '拾毛新品百貨',
      to:"/ProductPage"
    },
    {
      label: '拾毛二手市場',
      to:"/SeProductPage"
    },
    {
      label: '寵物小知識',
      submenu: [
        { label: '小文章' },
        { label: '新手飼養指南', to: '/Novicefeeding/dog' },
        { label: '健康檢查篇', to: '/HealthCheck/dog' },
        { label: '互動小專區' },
        { label: '部位有話說', to: '/PartTouch/Touch' },
        { label: '問答知多少', to: '/PetQuiz/Quiz' }
      ]
    }
  ];

  return (
    <nav className={navstyles.mainNav}>
      <ul className={navstyles.menu}>
        {/* 關於好拾毛 */}
        <li className={navstyles.dropdown}>
          <NavLink to="#">關於好拾毛</NavLink>
          <ul className={navstyles.dropdownMenu}>
            <li><NavLink to="/Aboutus">關於我們</NavLink></li>
            <li><NavLink to="/Help">幫助中心</NavLink></li>
          </ul>
        </li>

        {/* 拾毛百貨 / 拾毛市場 */}
        {paths.map(path => (
          <li key={path}
            className={navstyles.menuItem}
            onMouseEnter={() => setOpenKey(path)}
            onMouseLeave={() => setOpenKey(null)}
          >

            <NavLink
              to={path}
              className={navstyles.menuLink}
              activeClassName={navstyles.activeLink}
            >
              {pageNames[path]}
            </NavLink>


            {/* 這裡渲染 MegaMenu */}
            <MegaMenu
              pageKey={path}
              pageName={pageNames[path]}
              openKey={openKey}

              // 左右選項狀態都存在 mainNav state：petByKey[path], tabByKey[path]
              selectedPet={petByKey[path]}
              activeTab={tabByKey[path]}

              // 當 MegaMenu 初始化或點選時，更新 mainNav state
              onPetChange={pet => setPetByKey(k => ({ ...k, [path]: pet }))}
              onTabChange={t => setTabByKey(k => ({ ...k, [path]: t }))}
            />
          </li>
        ))}

        {/* 其他下拉選單不動 */}
        <li className={navstyles.dropdown}>
          <NavLink to="#">寵物小知識</NavLink>
          <ul className={navstyles.dropdownMenu}>
            <li className={navstyles.noLink}><span>知識小文章</span></li>
            <li><NavLink to="/Novicefeeding/dog">新手飼養指南</NavLink></li>
            <li><NavLink to="/HealthCheck/dog">健康檢查篇</NavLink></li>
            <li className={navstyles.noLink}><span>互動小專區</span></li>
            <li><NavLink to="/PartTouch/Touch">部位有話說</NavLink></li>
            <li><NavLink to="/PetQuiz/Quiz">問答知多少</NavLink></li>
          </ul>
        </li>
      </ul>
      {/* 手風琴的下拉式選單 */}
      <ul className={navstyles.accordionMenu}>
        {items.map((item, i) => (
          <li key={i}>
            <div
              className={navstyles.header}
              onClick={() => item.submenu && handleClick(i)}
            >
              {item.submenu
                ? <span className={navstyles.headerText}>{item.label}</span>
                : <NavLink to={item.to}>{item.label}</NavLink>
              }
              {item.submenu && (
                <span className={navstyles.arrow}>
                  {openIndex === i ? '▾' : '▸'}
                </span>
              )}
            </div>
            {item.submenu && openIndex === i && (
              <ul className={navstyles.submenu}>
                {item.submenu.map((sub, j) => (
                  <li key={j}>
                    {sub.to
                      ? <NavLink to={sub.to}>{sub.label}</NavLink>
                      : <span className={navstyles.noLink}>{sub.label}</span>
                    }
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
