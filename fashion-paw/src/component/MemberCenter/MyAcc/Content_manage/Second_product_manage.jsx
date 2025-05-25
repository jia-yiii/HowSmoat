// src/component/MemberCenter/MyAcc/SecondProductManage.jsx
import React, { Component } from 'react';
import axios from 'axios';
import MarketModal from '../market_manage/Market_Modal';
import Pagination from './Page_manage';
import PawDisplay from '../../../ProductDetailPage/PawDisplay';
import styles from './Second_product_manage.module.css'

export default class SecondProductManage extends Component {
  state = {
    second_product: [],
    loading: true,
    error: null,
    showModal: false,
    ModalState: 'Add',   // 'Add' | 'Find' | 'Edit'
    currentProduct: null,
    currentPage: 1,
    searchTerm: ''       // 🔍 搜尋關鍵字
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    try {
      const res = await axios.get('http://localhost:8000/get/second-products');
      // 用 Map 去重，只保留第一張圖代表的那筆
      const unique = [...new Map(
        res.data.map(item => [item.pid, item])
      ).values()];
      this.setState({ second_product: unique, loading: false });
    } catch (err) {
      console.error(err);
      this.setState({ error: '無法取得二手商品', loading: false });
    }
  };

  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  };

  OpenAdd = () =>
    this.setState({ ModalState: 'Add', currentProduct: null, showModal: true });

  // OpenFound = async index => {
  //   const { pid } = this.state.second_product[index];
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8000/get/second-products/${pid}`
  //     );
  //     this.setState({ ModalState: 'Find', currentProduct: res.data, showModal: true });
  //   } catch {
  //     alert('無法取得商品詳情');
  //   }
  // };

  OpenEdit = async index => {
    const { pid } = this.state.second_product[index];
    try {
      const res = await axios.get(
        `http://localhost:8000/get/second-products/${pid}`
      );
      this.setState({ ModalState: 'Edit', currentProduct: res.data, showModal: true });
    } catch {
      alert('無法取得商品詳情');
    }
  };

  Delete = async index => {
    const { pid } = this.state.second_product[index] || {};
    if (!pid || !window.confirm('確定刪除？')) return;
    try {
      await axios.delete(`http://localhost:8000/get/second-products/${pid}`);
      alert('刪除成功！');
      this.loadData();
      this.setState({ currentPage: 1 });
    } catch {
      alert('刪除失敗，請稍後再試');
    }
  };

  new = async pd => {
    try {
      await axios.post('http://localhost:8000/get/second-products', pd);
      alert('新增成功！');
      this.loadData();
      this.setState({ showModal: false, currentPage: 1 });
    } catch {
      alert('新增失敗，請稍後再試');
    }
  };

  edit = async pd => {
    try {
      await axios.put(
        `http://localhost:8000/get/second-products/${pd.pid}`,
        pd
      );
      alert('修改成功！');
      this.loadData();
      this.setState({ showModal: false });
    } catch {
      alert('更新失敗，請稍後再試');
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  // 🔍 處理搜尋輸入
  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value, currentPage: 1 });
  };

  renderStatus = st =>
    st === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>;


  renderCategory = cat =>
  ({
    pet_food: '飼料',
    complementary_food: '副食',
    snacks: '零食',
    Health_Supplements: '保健食品',
    Living_Essentials: '生活家居',
    toys: '玩具'
  }[cat] || cat);

  render() {
    const {
      second_product,
      loading,
      error,
      showModal,
      ModalState,
      currentProduct,
      currentPage,
      searchTerm
    } = this.state;

    // 先依搜尋關鍵字過濾，再做分頁
    const filtered = second_product.filter(p =>
      p.pd_name.includes(searchTerm)
    );
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        {/* 搜尋欄 */}
        <div className="mb-3" style={{ maxWidth: 300 }}>
          <input
            type="text"
            className="form-control"
            placeholder="搜尋商品名稱"
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
        </div>

        {loading && <div>載入中…</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            <table className={`table table-striped ${styles.tablestriped}`}>
              <thead className={styles.tableprimary}>
                <tr>
                  <th>主圖</th>
                  <th>名稱</th>
                  <th>價格</th>
                  <th>類型</th>
                  <th>新舊程度</th>
                  <th>狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p, i) => (
                  <tr key={p.pid}>
                    <td>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt=""
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      ) : (
                        <span className="text-muted">無圖</span>
                      )}
                    </td>
                    <td>{p.pd_name}</td>
                    <td>NT${p.price}</td>
                    <td>{this.renderCategory(p.categories)}</td>
                    <td><PawDisplay rating={Number(p.new_level)} /></td>
                    <td>{this.renderStatus(p.status)}</td>
                    <td>
                      <button
                        className={styles.btn}
                        onClick={() => window.location.href = `/product/${p.pid}`}
                      >
                        查看
                      </button>
                      <button
                        className={styles.btnsubmit}
                        onClick={() => this.OpenEdit(startIndex + i)}
                      >
                        編輯
                      </button>
                      <button
                        className={styles.btndel}
                        onClick={() => this.Delete(startIndex + i)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </>
        )}

        {showModal && (
          <MarketModal
            condition="second"
            modalState={ModalState}
            product={currentProduct}
            new={this.new}
            edit={this.edit}
            close={this.toggleModal}
          />
        )}
      </>
    );
  }
}
