// src/component/Homepage/InfoSection.jsx
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import styles from './InfoSection.module.css'
import pawicon from './images/pawicon.svg'

export default function InfoSection() {
  const [articles, setArticles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const topicMap = {
    pet_feeding:  'Novicefeeding',
    health_check: 'HealthCheck',
  }

  useEffect(() => {
    axios.get('http://localhost:8000/get/article')
      .then(res => {
        // 1) 先把 raw row 轉成我們想要的 key
        const mapped = res.data.map(row => {
        const type = row.article_type?.trim()
        const cleanedPath = row.banner_URL?.replace(/\\/g, '/')

        const imgPath = (type && cleanedPath)
          ? `/media/pet_know/${type}/${cleanedPath}`
          : '/media/default/no-image.png'

        return {
          id:            row.ArticleID,
          title:         row.title,
          img:           imgPath,
          created_at:    row.create_at,
          pet_type:      row.pet_type,
          article_type:  row.article_type,
        }
      })
        // 2) 排序、取最新 4 筆
        const sorted4 = mapped
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4)
        setArticles(sorted4)
      })
      .catch(err => {
        console.error('載入文章失敗', err)
        setError('載入文章失敗')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className={styles.status}>載入中…</p>
  if (error)   return <p className={styles.statusError}>{error}</p>

  return (
    <section className={styles.infoSection}>
      <h2 className={styles.title}>毛孩健康知識<img src={pawicon} className={styles.icon} /></h2>
      <div className={styles.grid}>
        {articles.map(item => {
          const topic = topicMap[item.article_type] || 'Novicefeeding'
          const pet   = item.pet_type
          return (
            <NavLink
              key={item.id}
              to={`/${topic}/${pet}/${item.id}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={item.img || '/media/default/no-image.png'}
                  alt={item.title}
                />
              </div>
              <div className={styles.content}>
                <p className={styles.date}>
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
                <p className={styles.text}>{item.title}</p>
                <span className={styles.cta}>繼續閱讀</span>
              </div>
            </NavLink>
          )
        })}
      </div>
    </section>
  )
}
