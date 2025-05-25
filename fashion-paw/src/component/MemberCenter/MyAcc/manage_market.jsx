import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Market_modal from './market_manage/Market_Modal'
import PawDisplay from '../../ProductDetailPage/PawDisplay'
import styles from './manage_market.module.css'

// 全域設定
const BASE_URL = 'http://localhost:8000'

export default class ManageMarket extends Component {
  constructor(props) {
    super(props)
    this.selectRef = React.createRef();
    this.state = {
      second_product: [],
      searchTerm: '',
      page: 1,
      pageSize: 5,
      loading: false,
      error: null,
      showModal: false,
      ModalState: 'Add', // 'Add' | 'Find' | 'Edit'
      thisIndex: -1
    }
  }
  componentDidMount() {
    // 初次掛載時載入資料
    this.loadData()
  }

  // 取得二手商品清單（含屬性、補足四格圖片 slot）
  loadData = async () => {
    this.setState({ loading: true, error: null })
    try {
      const uid = Cookies.get('user_uid')
      if (!uid) throw new Error('請先登入')
      const { data } = await axios.get(
        `${BASE_URL}/get/my-second-products`,
        { headers: { 'X-UID': uid } }
      )
      const items = (data || []).map(item => ({
        ...item,
        attribute: item.attribute || {},
        images: Array(4).fill().map((_, i) => item.images[i] || { id: '', img_path: '', img_value: '' })
      }))
      this.setState({ second_product: items, loading: false })
    } catch (err) {
      const errorMsg = err.response
        ? `伺服器錯誤 (${err.response.status})`
        : err.request
          ? '無法連線伺服器，請確認後端是否啟動'
          : err.message
      this.setState({ error: errorMsg, loading: false })
    }
  }

  toggleModal = () => this.setState(s => ({ showModal: !s.showModal }))
  OpenAdd = () => this.setState({ ModalState: 'Add', thisIndex: -1 }, this.toggleModal)
  OpenFound = i => this.setState({ ModalState: 'Find', thisIndex: i }, this.toggleModal)
  OpenEdit = i => this.setState({ ModalState: 'Edit', thisIndex: i }, this.toggleModal)

  Delete = async i => {
    const { pid, pd_name } = this.state.second_product[i] || {}
    if (!pid || !window.confirm(`確定刪除 ${pd_name}？`)) return
    try {
      const uid = Cookies.get('user_uid')
      await axios.delete(
        `${BASE_URL}/get/my-second-products/${pid}`,
        { headers: { 'X-UID': uid } }
      )
      alert('刪除成功！')
      this.loadData()
    } catch {
      alert('刪除失敗，請稍後再試')
    }
  }

  new = async product => {
    try {
      const uid = Cookies.get('user_uid')
      const form = new FormData()
      // 基本欄位
      ['pd_name', 'price', 'categories', 'new_level', 'status', 'pet_type', 'description', 'stock', 'city', 'district']
        .forEach(k => form.append(k, product[k]))
      // 圖片
      product.images.forEach(img => img.file && form.append('images', img.file))
      // 屬性
      Object.entries(product.attribute).forEach(([k, v]) => form.append(`attribute.${k}`, v))
      await axios.post(
        `${BASE_URL}/get/my-second-products`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data', 'X-UID': uid } }
      )
      alert('新增成功！')
      this.toggleModal()
      this.loadData()
    } catch (err) {
      console.error('新增失敗：', err)
      alert('新增失敗，請稍後再試')
    }
  }

  edit = async product => {
    try {
      const uid = Cookies.get('user_uid')
      const form = new FormData()
      ['pd_name', 'price', 'categories', 'new_level', 'status', 'pet_type', 'description', 'stock', 'city', 'district']
        .forEach(k => form.append(k, product[k]))
      product.images.forEach(img => img.file && form.append('images', img.file))
      Object.entries(product.attribute).forEach(([k, v]) => form.append(`attribute.${k}`, v))
      await axios.put(
        `${BASE_URL}/get/my-second-products/${product.pid}`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data', 'X-UID': uid } }
      )
      alert('更新成功！')
      this.toggleModal()
      this.loadData()
    } catch (err) {
      console.error('更新失敗：', err)
      alert('更新失敗，請稍後再試')
    }
  }

  calladmin = async (pd_name) => {
    const speakerID = Cookies.get("user_uid");
    const selectVal = this.selectRef.current?.value || '';
    if (!selectVal) return alert('請先選擇回報原因');

    const userText = `${pd_name}：${selectVal}
    <br>請幫我刪除</br>`;
    const botText = '客服已收到通知囉，會儘快幫您處理！';
    const roomId = '12';

    try {
      // 1. 寫入使用者回報到 chatroomID=11
      await axios.post('http://localhost:8000/post/insert/message', {
        ChatroomID: roomId,
        speakerID,
        message: userText,
        isRead: 1
      });

      // 2. 寫入客服回覆到同一個聊天室
      await axios.post('http://localhost:8000/post/insert/message', {
        ChatroomID: roomId,
        speakerID: '0',
        message: botText,
        isRead: 1
      });

      // 3. 推播到前端聊天室 (ChatApp 裡監聽 newChatMessage)
      window.dispatchEvent(new CustomEvent('newChatMessage', {
        detail: { chatroomID: roomId, text: userText, from: 'user' }
      }));
      window.dispatchEvent(new CustomEvent('newChatMessage', {
        detail: { chatroomID: roomId, text: botText, from: 'bot' }
      }));

      alert('回報已送出，感謝您的回饋！');
    } catch (err) {
      console.error('calladmin 失敗', err);
      alert('回報失敗，請稍後再試');
    }
  }






  handleSearchChange = e => this.setState({ searchTerm: e.target.value })

  renderStatus = s => s === 1
    ? <span className="badge bg-success">上架</span>
    : <span className="badge bg-secondary">下架</span>

  renderCategory = cat => ({
    pet_food: "飼料", complementary_food: "副食", snacks: "零食",
    Health_Supplements: "保健食品", Living_Essentials: "生活家居", toys: "玩具"
  }[cat] || cat)

  renderCategory = cat =>
  ({
    pet_food: "飼料",
    complementary_food: "副食",
    snacks: "零食",
    Health_Supplements: "保健食品",
    Living_Essentials: "生活家居",
    toys: "玩具"
  }[cat] || cat);

  findProduct = i => this.state.second_product[i] || null
  setPage = page => this.setState({ page })

  render() {
    const { second_product, searchTerm, page, pageSize, loading, error, showModal, ModalState, thisIndex } = this.state
    const filtered = second_product.filter(p => p.pd_name.includes(searchTerm))
    const totalPages = Math.ceil(filtered.length / pageSize)
    const start = (page - 1) * pageSize
    const paged = filtered.slice(start, start + pageSize)

    return (
      <div className="container-fluid mt-4">
        <h4 style={{ color: "#333" }}>二手商品管理</h4>
        {/* 搜尋 & 新增 */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* 左邊：搜尋列 */}
          <div style={{ maxWidth: 300 }}>
            <input
              type="search"
              className="form-control"
              placeholder="搜尋商品名稱或類別"
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </div>

          {/* 右邊：上架按鈕 */}
          <button
            className={styles.btnadd}
            onClick={this.OpenAdd}
          >
            商品上架
          </button>
        </div>



        {/* 狀態顯示 */}
        {loading && <div>載入中…</div>}
        {error && <div className="text-danger">{error}</div>}

        {/* 商品列表 */}
        {!loading && !error && (
          <table className={`table table-striped align-middle ${styles.tablestriped}`}>
            <thead className={styles.tableprimary}>
              <tr>
                <th>主圖</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th>類型</th>
                <th>新舊程度</th>
                <th>狀態</th>
                <th>操作</th>
                <th>回報錯誤</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p, idx) => (
                <tr key={p.pid}>
                  <td style={{ width: 120, whiteSpace: 'nowrap' }}>
                    {(() => {
                      const imgs = p.images.filter(img => img.img_path);
                      if (!imgs.length) return <span className="text-muted">無圖</span>;
                      const img = imgs[0];
                      return (
                        <img
                          src={img.img_path}
                          alt={img.img_value || '圖'}
                          className="img-thumbnail"
                          style={{ width: 60, height: 60 }}
                        />
                      );
                    })()}
                  </td>
                  <td>{p.pd_name}</td>
                  <td>NT${p.price}</td>
                  <td>{this.renderCategory(p.categories)}</td>
                  <td><PawDisplay rating={Number(p.new_level)} /></td>
                  <td>{this.renderStatus(p.status)}</td>
                  <td>
                    <button
                      className={styles.btnadd}
                      onClick={() => window.location.href = `/product/${p.pid}`}
                    >
                      查看
                    </button>
                    <button className={styles.btnsubmit} onClick={() => this.OpenEdit(start + idx)}>編輯</button>
                    {/* <button className={styles.btndel} onClick={() => this.Delete(start + idx)}>刪除</button> */}
                  </td>
                  <td>
                    <select ref={this.selectRef}>
                      <option value="">----選擇----</option>
                      <option value="無法出貨">無法出貨</option>
                      <option value="貨物損毀">貨物損毀</option>
                      <option value="重複上架">重複上架</option>
                    </select>
                    <p></p>
                    <button className='btn btn-danger' onClick={() => this.calladmin(p.pd_name)}>回報</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 分頁 */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-start">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className={styles.btnadd} onClick={() => this.setPage(page - 1)}>
                上一頁
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? 'active' : ''}`}
              >
                <button className={styles.bb} onClick={() => this.setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className={styles.btnadd} onClick={() => this.setPage(page + 1)}>
                下一頁
              </button>
            </li>
          </ul>
        </nav>


        {/* Modal */}
        {showModal && (
          <Market_modal
            condition="second" modalState={ModalState}
            product={this.findProduct(thisIndex)}
            new={this.new} edit={this.edit}
            close={this.toggleModal}
          />
        )}
      </div>
    )
  }
}