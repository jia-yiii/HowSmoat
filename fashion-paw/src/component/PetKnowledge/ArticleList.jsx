// src/components/ArticleList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import Pagination from './Pagination';
import styles from './ArticleList.module.css';

export default function ArticleList({ topic, pet }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5;

  const typeMap = {
    Novicefeeding: 'pet_feeding',
    HealthCheck: 'health_check'
  };
  const articleType = typeMap[topic];

  useEffect(() => {
    axios.get('/api/articles', {
      params: {
        topic: articleType,   // 原本的 type 改成 topic
        pet,
        page,
        size: PAGE_SIZE
      }
    })
    .then(res => {
      setArticles(res.data.list);
      setTotalPages(res.data.totalPages);
    })
    .catch(err => console.error('取得文章失敗', err));
  }, [articleType, pet, page]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        {articles.map(a => (
          <ArticleCard key={a.id} {...a} topic={topic} pet={pet} />
        ))}
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
