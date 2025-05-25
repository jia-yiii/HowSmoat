import React, { Component } from 'react';
import axios from 'axios';
import Market_modal from '../market_manage/Market_Modal';
import Pagination from './Page_manage';

export default class New_Products_Manage extends Component {
  state = {
    showModal: false,
    ModalState: "Add",   // "Add" | "Find" | "Edit"
    thisIndex: -1,
    currentPage: 1,
    searchTerm: '',       // 新增搜尋輸入
    new_product: []       // 從 /get/new-products 載入
  };

  async componentDidMount() {
    try {
      const res = await axios.get('http://localhost:8000/get/new-products');
      this.setState({ new_product: res.data });
    } catch (err) {
      console.error("取得新品清單失敗：", err);
    }
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  }

  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  }

  findProduct = idx => this.state.new_product[idx] || {}

  renderStatus = status =>
    status === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>;

  renderCategory = cat => ({
    pet_food: "飼料",
    complementary_food: "副食",
    snacks: "零食",
    Health_Supplements: "保健食品",
    Living_Essentials: "生活家居",
    toys: "玩具"
  }[cat] || cat);

  OpenFound = idx =>
    this.setState({ ModalState: "Find", thisIndex: idx }, this.toggleModal);

  OpenEdit = idx =>
    this.setState({ ModalState: "Edit", thisIndex: idx }, this.toggleModal);

  OpenAdd = () =>
    this.setState({ ModalState: "Add", thisIndex: -1 }, this.toggleModal);

  Delete = async idx => {
    const { pid } = this.state.new_product[idx];
    try {
      await axios.delete(`http://localhost:8000/get/new-products/${pid}`);
      this.setState(s => ({
        new_product: s.new_product.filter((_, i) => i !== idx),
        showModal: false
      }));
    } catch (err) {
      console.error("刪除新品失敗：", err);
    }
  }

  new = async product => {
    try {
      const res = await axios.post('http://localhost:8000/get/new-products', product);
      this.setState(s => ({
        new_product: [res.data, ...s.new_product],
        showModal: false
      }));
    } catch (err) {
      console.error("新增新品失敗：", err);
    }
  }

  edit = async product => {
    try {
      const res = await axios.put(
        `http://localhost:8000/get/new-products/${product.pid}`,
        product
      );
      this.setState(s => {
        const arr = [...s.new_product];
        arr[s.thisIndex] = res.data;
        return { new_product: arr, showModal: false };
      });
    } catch (err) {
      console.error("更新新品失敗：", err);
    }
  }

  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value, currentPage: 1 });
  }

  getFilteredProducts() {
    const { new_product, searchTerm } = this.state;
    if (!searchTerm) return new_product;
    return new_product.filter(p =>
      p.pd_name.includes(searchTerm) ||
      p.categories.includes(searchTerm)
    );
  }

  render() {
    const {
      showModal,
      ModalState,
      thisIndex,
      currentPage,
      searchTerm
    } = this.state;

    const filtered = this.getFilteredProducts();
    const itemsPerPage = 5;
    const startIndex   = (currentPage - 1) * itemsPerPage;
    const pageItems    = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        {/* 搜尋列 */}
        <div className="mb-3">
          <form className="mb-2">
            <label htmlFor="sort" className="me-2">搜尋:</label>
            <input
              type="search"
              id="sort"
              className="form-control d-inline-block w-25"
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </form>
          <button className="btn btn-outline-primary" onClick={this.OpenAdd}>
            上架新品
          </button>
        </div>

        <table className="table table-striped table-hover">
          <thead className="table-primary">
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
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    : <span className="text-muted">無圖</span>
                  }
                </td>
                <td>{p.pd_name}</td>
                <td>{p.price}</td>
                <td>{this.renderCategory(p.categories)}</td>
                <td>{this.renderStatus(p.status)}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => this.OpenFound(startIndex + idx)}
                  >查看</button>
                  <button
                    className="btn btn-warning btn-sm me-1"
                    onClick={() => this.OpenEdit(startIndex + idx)}
                  >編輯</button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`確定要刪除 ${p.pd_name}？`)) {
                        this.Delete(startIndex + idx);
                      }
                    }}
                  >刪除</button>
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

        {showModal && (
          <Market_modal
            key={`${ModalState}-${thisIndex}`} // 重新掛載確保同步
            close={this.toggleModal}
            new={this.new}
            edit={this.edit}
            product={this.findProduct(thisIndex)}
            modalstate={ModalState}
          />
        )}
      </>
    );
  }
}
