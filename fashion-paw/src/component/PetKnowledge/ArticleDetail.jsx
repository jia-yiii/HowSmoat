// src/component/PetKnowledge/ArticleDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './ArticleDetail.module.css'
import RecommendedProducts from './Novicefeeding/RecommendedProducts'  // 推薦商品

export default function ArticleDetail({ topic }) {
  const { pet, articleId } = useParams()
  const [art, setArt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/articles/${articleId}`)
      .then(({ data }) => {
        let secs = data.sections
        try {
          secs = typeof secs === 'string' ? JSON.parse(secs) : secs
        } catch {
          secs = []
        }
        setArt({ ...data, sections: secs })
      })
      .catch(() => setArt(null))
      .finally(() => setLoading(false))
  }, [articleId])

  if (loading) return <p className={styles.loading}>載入中…</p>
  if (!art)     return <p className={styles.loading}>找不到這篇文章</p>

  return (
    <div className={styles.container}>
      <div className={styles.detailWrapper}>
        {art.bannerUrl && (
          <img
            className={styles.mainImage}
            src={art.bannerUrl}
            alt={art.title}
          />
        )}
        <div className={styles.header}>
          <h1 className={styles.title}>{art.title}</h1>
          <p className={styles.meta}>
            發表日期：{new Date(art.date).toLocaleDateString()} ｜ 分類：{topic}
          </p>
        </div>
        {art.summary && (
          <p className={styles.summary}>{art.summary}</p>
        )}
        <div className={styles.sections}>
          {art.sections.map((sec, i) => (
            <div key={i} className={styles.section}>
              {sec.heading && (
                <h2 className={styles.secHeading}>{sec.heading}</h2>
              )}
              <div
                className={styles.secBody}
                dangerouslySetInnerHTML={{ __html: sec.body || '' }}
              />
            </div>
          ))}
        </div>
        {/* 推薦商品列表 */}
        <div className={styles.recommendWrapper}>
          {/* <h2>推薦商品</h2> */}
          <RecommendedProducts pet_type={pet} />
        </div>
      </div>
    </div>
  )
}
