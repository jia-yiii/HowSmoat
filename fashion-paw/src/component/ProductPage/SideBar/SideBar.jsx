import React, { useState } from 'react';
import styles from './SideBar.module.css';

const CATEGORY_MAP = [
  { label: '飼料',     value: 'pet_food'           },
  { label: '副食',     value: 'complementary_food' },
  { label: '零食',     value: 'snacks'             },
  { label: '保健食品', value: 'Health_Supplements' },
  { label: '生活家居', value: 'Living_Essentials'  },
  { label: '玩具',     value: 'toys'               },
];

export default function Sidebar({ onSelectCategory = () => {} }) {
  const [expandedType, setExpandedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({ type: '', cat: '' });

  const toggleType = type => {
    if (expandedType === type) {
      // 收起時：清掉 type & cat
      setExpandedType(null);
      setSelectedCategory({ type: '', cat: '' });
      onSelectCategory('', '');
    } else {
      // 展開時：只篩選 type，cat留空＝顯示該type所有分類
      setExpandedType(type);
      setSelectedCategory({ type, cat: '' });
      onSelectCategory(type, '');
    }
  };

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {['dog','cat','bird','mouse'].map(type => (
          <li key={type}>
            <button
              onClick={() => toggleType(type)}
              className={styles.expandBtn}
            >
              {{
                dog:   '狗狗專區',
                cat:   '貓咪專區',
                bird:  '鳥類專區',
                mouse: '倉鼠專區',
              }[type]}
              {expandedType === type ? ' ▾' : ' ▸'}
            </button>

            {expandedType === type && (
              <ul className={styles.sublist}>
                {CATEGORY_MAP.map(({ label, value }) => (
                  <li
                    key={value}
                    onClick={() => {
                      setSelectedCategory({ type, cat: value });
                      onSelectCategory(type, value);
                    }}
                    className={`
                      ${styles.subitem}
                      ${selectedCategory.type === type && selectedCategory.cat === value
                        ? styles.active : ''}
                    `}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
