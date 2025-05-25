// src/components/ArticleCard.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ArticleCard.module.css';

// 類別標籤對應
const typeLabelMap = {
  pet_feeding: '新手飼養',
  health_check: '健康檢查'
};

export default function ArticleCard(props) {
  // 有 title 表示列表預覽模式
  const isPreview = !!props.title;
  // 詳情模式才用 useParams
  const params = useParams();
  const id    = isPreview ? props.id    : params.id;
  const topic = isPreview ? props.topic : params.topic;
  const pet   = isPreview ? props.pet   : params.pet;

  // 文章資料 state
  const [article, setArticle] = useState(isPreview ? { ...props } : null);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!isPreview) {
      axios.get(`/api/petknowarticle/${id}`)
        .then(res => setArticle(res.data))
        .catch(() => setError('載入文章失敗'));
    }
  }, [id, isPreview]);

  if (error)    return <div className={styles.error}>{error}</div>;
  if (!article) return <div className={styles.loading}>載入中…</div>;

  // 決定要不要關閉 hover（詳情模式才關閉）
  const className = isPreview
    ? styles.card
    : `${styles.card} ${styles.noHover}`;
    console.log('▶ Article data:', article);
  const CardContent = (
    <>
      <img
        src={article.bannerUrl}
        alt={article.title}
        className={styles.thumb}
      />
      <div className={styles.info}>
        <h3>{article.title}</h3>

        {isPreview ? (
          <p>{article.summary}</p>
        ) : (
          <>
            <small className={styles.date}>
              {new Date(article.date).toLocaleDateString()}
            </small>
            <small className={styles.typeLabel}>
              {typeLabelMap[article.articleType] || ''}
            </small>
            <p className={styles.summary}>{article.summary}</p>
            {JSON.parse(article.sections || '[]').map((sec, i) => (
              <section key={i} className={styles.section}>
                {sec.heading && <h4>{sec.heading}</h4>}
                <p>{sec.body}</p>
              </section>
            ))}
          </>
        )}
      </div>
    </>
  );

  return isPreview ? (
    <NavLink to={`/${topic}/${pet}/${id}`} className={className}>
      {CardContent}
    </NavLink>
  ) : (
    <article className={className}>
      {CardContent}
    </article>
  );
}
