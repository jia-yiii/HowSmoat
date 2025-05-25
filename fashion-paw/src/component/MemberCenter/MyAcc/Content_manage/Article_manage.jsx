// src/component/MemberCenter/MyAcc/Article_manage.jsx
import React, { Component } from 'react';
import Pagination from './Page_manage';
import Article_modal from './Article_modal';
import axios from 'axios';
import styles from './Article_manage.module.css'

export default class Article_manage extends Component {
  state = {
    articles: [],
    searchTerm: '',       // 🔍 搜尋關鍵字
    currentPage: 1,
    itemsPerPage: 10,
    showModal: false,
    modalMode: 'Add',     // 'Add' or 'Edit'
    modalArticle: { sections: [] },
  };

  componentDidMount() {
    this.loadArticles();
  }

  loadArticles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/get/article');
      // 解析並格式化資料
      const mapped = res.data.map(a => {
        let sections = [];
        try {
          sections = JSON.parse(a.sections || '[]');
        } catch { }
        const banner_URL = a.banner_URL || '';
        return {
          ArticleID: a.ArticleID,
          title: a.title,
          intro: a.intro,
          product_category: a.product_category,
          article_type: a.article_type,
          pet_type: a.pet_type,
          sections,
          create_at: new Date(a.create_at).toLocaleString(),
          banner_URL
        };
      });
      this.setState({ articles: mapped });
    } catch (err) {
      console.error('讀取文章失敗：', err);
      alert('讀取文章失敗，請稍後再試');
    }
  };

  // 搜尋欄輸入
  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value, currentPage: 1 });
  };

  // 過濾文章
  filteredArticles = () => {
    const { articles, searchTerm } = this.state;
    if (!searchTerm.trim()) return articles;
    return articles.filter(a =>
      a.title.includes(searchTerm) ||
      a.intro.includes(searchTerm)
    );
  };

  // 打開新增 modal
  openAdd = () => {
    this.setState({
      showModal: true,
      modalMode: 'Add',
      modalArticle: { sections: [] },
    });
  };

  // 打開編輯 modal
  openEdit = index => {
    const article = this.filteredArticles()[index];
    this.setState({
      showModal: true,
      modalMode: 'Edit',
      modalArticle: { ...article },
    });
  };

  // 新增文章
  createArticle = async form => {
    try {
      // 1. 用 form 建立 FormData
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('intro', form.intro);
      fd.append('pet_type', form.pet_type);
      fd.append('product_category', form.product_category);
      fd.append('article_type', form.article_type);
      fd.append('sections', JSON.stringify(form.sections || []));
      if (form.banner_URL instanceof File) {
        fd.append('banner_URL', form.banner_URL);
      }

      // 2. 送出給後端，讓 axios 自動帶 boundary
      const res = await axios.post(
        'http://localhost:8000/api/create/article',
        fd
      );

      // 3. 收到 insertId，組出新文章物件
      const newId = res.data.insertId;
      const newArticle = {
        ...form,
        ArticleID: newId,
        create_at: new Date().toLocaleString(),
        banner_URL: form.banner_URL_preview
          ? `/media/pet_know/${form.article_type}/${form.pet_type}/${form.banner_URL_preview}`
          : ''
      };

      // 4. 更新列表並關閉 Modal
      this.setState(s => ({
        articles: [newArticle, ...s.articles],
        showModal: false,
      }));
    } catch (err) {
      console.error('新增文章失敗：', err);
      alert('新增文章失敗：' + (err.response?.data?.error || err.message));
    }
  };

  // Article_manage.jsx 裡的 editArticle
editArticle = async form => {
  try {
    // 送出更新（若已經改成 FormData 就用 FormData，這裡示範原本 JSON 寫法）
    await axios.put(
      `http://localhost:8000/api/update/article/${form.ArticleID}`,
      { ...form, sections: JSON.stringify(form.sections) }
    );

    // 👉 新增這行：編輯成功提示
    alert('編輯成功');

    // 更新列表並關閉 Modal
    this.setState(s => ({
      articles: s.articles.map(a =>
        a.ArticleID === form.ArticleID ? form : a
      ),
      showModal: false,
    }));
  } catch (err) {
    console.error('編輯文章失敗：', err);
    alert('編輯文章失敗：' + (err.response?.data?.error || err.message));
  }
};


  // 刪除文章
  deleteArticle = async index => {
    const article = this.filteredArticles()[index];
    if (!window.confirm(`確定要刪除《${article.title}》？`)) return;
    try {
      await axios.delete(`http://localhost:8000/api/article/${article.ArticleID}`);
      this.loadArticles();
    } catch (err) {
      console.error('刪除文章失敗：', err);
      alert('刪除文章失敗：' + (err.response?.data?.error || err.message));
    }
  };

  // 分頁
  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  render() {
    const {
      searchTerm,
      currentPage,
      itemsPerPage,
      showModal,
      modalMode,
      modalArticle,
    } = this.state;

    const filtered = this.filteredArticles();
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);

    return (
      <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* 搜尋欄 */}
        <div className="mt-3" style={{ maxWidth: 300 }}>
          <input
            type="search"
            className="form-control"
            placeholder="搜尋標題或摘要"
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
        </div>

        {/* 新增文章按鈕 放搜尋欄下面 */}
        <div className="mt-3">
          <button
            className={styles.btn}
            onClick={this.openAdd}
          >
            新增文章
          </button>
        </div>
        </div>

        {/* 文章列表 */}
        <table className={`table table-striped ${styles.tablestriped}`}>
          <thead className={styles.tableprimary}>
            <tr>
              <th>ArticleID</th>
              <th>標題</th>
              <th>摘要</th>
              <th>建立時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((a, i) => (
              <tr key={a.ArticleID}>
                <td>{a.ArticleID}</td>
                <td>{a.title}</td>
                <td>{a.intro}</td>
                <td>{a.create_at}</td>
                <td>
                  <button
                    className={styles.btnsubmit}
                    onClick={() => this.openEdit(start + i)}
                  >
                    編輯
                  </button>
                  <button
                    className={styles.btndel}
                    onClick={() => this.deleteArticle(start + i)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  無符合的文章
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 分頁 */}
        <Pagination
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />

        {/* Modal */}
        {showModal && (
          <Article_modal
            key={`${modalMode}-${modalArticle.ArticleID || 'new'}`}
            mode={modalMode}
            article={modalArticle}
            createArticle={this.createArticle}
            editArticle={this.editArticle}
            close={() => this.setState({ showModal: false })}
          />
        )}
      </>
    );
  }
}
