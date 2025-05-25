import React from 'react';
import Sidebar     from './SideBar';
import ArticleList from './ArticleList'
import styles      from './KnowledgeLayout.module.css';

export default function KnowledgeLayout({ match, topic }) {
  const { pet } = match.params;

  return (
    <div className={styles.container}>
    <Sidebar topic={topic} selected={pet} />
    <div className={styles.listWrapper}>
      <ArticleList topic={topic} pet={pet} />
    </div>
  </div>
);
}