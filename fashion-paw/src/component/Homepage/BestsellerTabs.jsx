import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './BestsellerTabs.module.css'
import pawicon from './images/pawicon.svg'
const API_BASE = 'http://localhost:8000'

const tabs = [
  { key: 'pet_food',           label: '飼料' },
  { key: 'complementary_food', label: '副食' },
  { key: 'snacks',             label: '零食' },
  { key: 'Health_Supplements', label: '保健食品' },
  { key: 'Living_Essentials',  label: '生活家居' },
  { key: 'toys',               label: '玩具' }
]

export default function BestsellerTabs() {
  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setLoading(true)
    axios.get(`${API_BASE}/get/category-ranking`)
      .then(res => {
        console.log('▶️ category-ranking raw data:', res.data)
        setData(res.data)
        setIndex(0)
      })
      .catch(err => {
        console.error('載入分類排行失敗', err)
        setError(err.response?.data || err.message || '載入失敗')
      })
      .finally(() => setLoading(false))
  }, [])

  const currentList = data.filter(item => item.category === activeKey)
  const itemsPerPage = 3

  const next = () => {
    if (index < currentList.length - itemsPerPage) setIndex(i => i + 1)
  }
  const prev = () => {
    if (index > 0) setIndex(i => i - 1)
  }

  return (
    <section className={styles.section}>
      <div className="container-lg">
        <h2 className={styles.title}>
          熱銷排行榜 <img src={pawicon} alt="paw" className={styles.icon} />
        </h2>
        <nav className={styles.tabNav}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${t.key === activeKey ? styles.active : ''}`}
              onClick={() => { setActiveKey(t.key); setIndex(0) }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="container-lg">
        {loading && <div className={styles.loading}>載入中…</div>}
        {error   && <div className={styles.error}>{error}</div>}

        {!loading && !error && currentList.length > 0 && (
          <div className={styles.slider}>
            <button onClick={prev} className={styles.arrow}>‹</button>
            <div className={styles.viewport}>
              <div
                className={styles.track}
                style={{
                  transform: `translateX(-${(100 / itemsPerPage) * index}%)`,
                  width: `${(100 / itemsPerPage) * currentList.length}%`
                }}
              >
                {currentList.map(prod => (
                  <div key={prod.pid} className={styles.slide}>
                    <a href={`/product/${prod.pid}`} className={styles.card}>
                      <img
                        src={prod.imageUrl || '/media/default/no-image.png'}
                        alt={prod.name}
                        className={styles.img}
                      />
                      <p className={styles.caption}>{prod.name}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={next} className={styles.arrow}>›</button>
          </div>
        )}

        {!loading && !error && currentList.length === 0 && (
          <div className={styles.noData}>暫無資料</div>
        )}
      </div>
    </section>
  )
}
