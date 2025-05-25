// src/component/MemberCenter/MyAcc/New_Products_Manage.jsx
import React, { Component } from 'react';
import axios from 'axios';
import MarketModal from '../market_manage/Market_Modal';
import Pagination from './Page_manage';
import styles from './New_product_manage.module.css'
import { Link } from 'react-router-dom';
export default class New_Products_Manage extends Component {
  state = {
    showModal: false,
    ModalState: 'Add',      // 'Add' | 'Find' | 'Edit'
    thisIndex: -1,
    currentPage: 1,
    searchTerm: '',         // 搜尋關鍵字
    new_product: [],        // 列表資料
    currentProduct: null    // 編輯/查看用
  };

  async componentDidMount() {
    this.loadList();
  }

  // 讀取新品清單
  loadList = async () => {
    try {
      const res = await axios.get('http://localhost:8000/get/new-products');
      this.setState({ new_product: res.data });
    } catch (err) {
      console.error('取得新品清單失敗：', err);
      alert('無法取得新品清單');
    }
  };

  // 分頁
  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  // 搜尋輸入
  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value, currentPage: 1 });
  };

  // 開關 Modal
  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  };

  // 新增
  OpenAdd = () => {
    this.setState({ currentProduct: null, ModalState: 'Add', showModal: true });
  };

  // // 查看
  // OpenFound = async idx => {
  //   const pid = this.filteredProducts()[idx].pid;
  //   try {
  //     const res = await axios.get(`http://localhost:8000/get/new-products/${pid}`);
  //     this.setState({ currentProduct: res.data, ModalState: 'Find', showModal: true });
  //   } catch (err) {
  //     console.error('讀取商品詳情失敗：', err);
  //     alert('無法取得商品詳情');
  //   }
  // };

  // 編輯
  OpenEdit = async idx => {
    const pid = this.filteredProducts()[idx].pid;
    try {
      const res = await axios.get(`http://localhost:8000/get/new-products/${pid}`);
      this.setState({ currentProduct: res.data, ModalState: 'Edit', showModal: true });
    } catch (err) {
      console.error('讀取商品詳情失敗：', err);
      alert('無法取得商品詳情');
    }
  };

  // 刪除
  Delete = async idx => {
    const pid = this.filteredProducts()[idx]?.pid;
    if (!pid || !window.confirm('確定要刪除？')) return;
    try {
      await axios.delete(`http://localhost:8000/get/new-products/${pid}`);
      alert('刪除成功');
      await this.loadList();
      this.setState({ currentPage: 1 });
    } catch (err) {
      console.error('刪除失敗：', err);
      alert('刪除失敗，請稍後再試');
    }
  };

  // 新增送出
  new = async pd => {
    try {
      await axios.post('http://localhost:8000/get/new-products', pd);
      alert('新增成功');
      this.loadList();
      this.toggleModal();
      this.setState({ currentPage: 1 });
    } catch (err) {
      console.error('新增失敗：', err);
      alert('新增失敗，請稍後再試');
    }
  };

  // 編輯送出
  edit = async pd => {
    try {
      await axios.put(`http://localhost:8000/get/new-products/${pd.pid}`, pd);
      alert('修改成功');
      this.loadList();
      this.toggleModal();
    } catch (err) {
      console.error('更新失敗：', err);
      alert('更新失敗，請稍後再試');
    }
  };

  // 過濾
  filteredProducts = () => {
    const { new_product, searchTerm } = this.state;
    if (!searchTerm) return new_product;
    return new_product.filter(p =>
      p.pd_name.includes(searchTerm) ||
      p.categories.includes(searchTerm)
    );
  };

  // 顯示上下架
  renderStatus = status =>
    status === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>;

  // 顯示類別
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
      showModal, ModalState, currentPage,
      searchTerm, currentProduct
    } = this.state;

    const filtered = this.filteredProducts();
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* 搜尋欄 */}
          <div className="mt-3" style={{ maxWidth: 300 }}>
            <input
              type="search"
              className="form-control"
              placeholder="搜尋商品名稱或類別"
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </div>

          {/* 新品上架按鈕 放搜尋欄下面 */}
          <div className="mt-3">
            <button
              className={styles.btn}
              onClick={this.OpenAdd}
            >
              新品上架
            </button>
          </div>
        </div>

        {/* 商品表格 */}
        <table className={`table table-striped ${styles.tablestriped}`}>
          <thead className={styles.tableprimary}>
            <tr>
              <th>主圖</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th>類型</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p, idx) => (
              <tr key={p.pid}>
                <td>
                  {p.imageUrl
                    ? <img
                      src={p.imageUrl}
                      alt={p.pd_name}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                    : <span className="text-muted">無圖</span>
                  }
                </td>
                <td>{p.pd_name}</td>
                <td>NT${p.price}</td>
                <td>{this.renderCategory(p.categories)}</td>
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
                    onClick={() => this.OpenEdit(startIndex + idx)}
                  >
                    編輯
                  </button>
                  <button
                    className={styles.btndel}
                    onClick={() => this.Delete(startIndex + idx)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
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
          <MarketModal
            key={`${ModalState}-${currentProduct?.pid || 'new'}`}
            condition="new"
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
