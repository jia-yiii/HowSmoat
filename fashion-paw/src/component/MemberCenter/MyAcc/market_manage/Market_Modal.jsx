import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // 新增引入 Cookies
import styles from './Market_Modal.module.css'

export default class MarketModal extends Component {
  constructor(props) {
    super(props);
    const { modalState, condition } = props;
    this.state = {
      modalState, // 'Add' | 'Edit' | 'Find'
      productData: {
        pid: '',
        condition: condition || '',
        status: 0,
        pet_type: '',
        categories: '',
        pd_name: '',
        price: 0,
        description: '',
        city: '',
        district: '',
        // uid 從 Cookie 取得，避免手動維護
        uid: Cookies.get('user_uid') || '',
        new_level: '',
        stock: 0,
        sale_count: 0,
        attribute: { brand: '', pattern: '', name: '', model: '', buydate: '', new_level: '', size: '', color: '', weight: '' },
        images: Array(4).fill().map(() => ({ file: null, img_value: '', img_path: '' }))
      }
    };
  }

  componentDidMount() {
    const { modalState, product } = this.props;
    // 先拿出原本的 productData
    let pd = { ...this.state.productData };

    // 如果是編輯或查看，且後端真的回傳了 product
    if ((modalState === 'Edit' || modalState === 'Find') && product) {
      pd = {
        ...pd,
        pid: product.pid ?? pd.pid,
        condition: product.condition ?? pd.condition,
        status: product.status ?? pd.status,
        pet_type: product.pet_type ?? pd.pet_type,
        categories: product.categories ?? pd.categories,
        pd_name: product.pd_name ?? pd.pd_name,
        price: product.price ?? pd.price,
        description: product.description ?? pd.description,
        city: product.city ?? pd.city,
        district: product.district ?? pd.district,
        new_level: product.new_level ?? pd.new_level,
        stock: product.stock ?? pd.stock,
        // 只有 product.attribute 存在時，才覆蓋原本的 attribute
        attribute: product.attribute
          ? { ...product.attribute }
          : { ...pd.attribute },
        // 同理處理圖片陣列
        images: Array(4).fill().map((_, i) => {
          const img = product.images?.[i];
          const path = img?.img_path || img?.imageUrl || '';
          return {
            file: null,
            img_value: img?.img_value || '',
            img_path: path
          };
        })
      };
    }

    // 最後把新的 pd push 回 state，並設定 modalState
    this.setState({ productData: pd, modalState });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(({ productData }) => ({ productData: { ...productData, [name]: value } }));
  };

  handleAttrChange = e => {
    const key = e.target.name.split('.')[1];
    const value = e.target.value;
    this.setState(({ productData }) => ({
      productData: {
        ...productData,
        attribute: { ...productData.attribute, [key]: value }
      }
    }));
  };

  uploadImageAtIndex = (idx, e) => {
    const file = e.target.files[0] || null;
    this.setState(({ productData }) => {
      const images = [...productData.images];
      images[idx] = { ...images[idx], file };
      return { productData: { ...productData, images } };
    });
  };

  handleValueChange = (idx, e) => {
    const img_value = e.target.value;
    this.setState(({ productData }) => {
      const images = [...productData.images];
      images[idx] = { ...images[idx], img_value };
      return { productData: { ...productData, images } };
    });
  };

  handleSubmit = async () => {
    const { modalState, productData } = this.state;
    const { onEdit, close } = this.props;
    const fd = new FormData();

    ['pd_name', 'price', 'description', 'pet_type', 'categories', 'city', 'district', 'new_level', 'status', 'condition', 'stock', 'delivery_method', 'pid']
      .forEach(key => { if (productData[key] !== undefined) fd.append(key, productData[key]); });

    Object.entries(productData.attribute).forEach(([k, v]) => fd.append(`attribute.${k}`, v));
    productData.images.forEach((img, idx) => {
      fd.append('image_id[]', img.id || '');
      // 这里 img.img_value 需要是唯一的，比如 '主图'、'副图1'、'副图2'……
      fd.append('img_value[]', img.img_value || `slot${idx}`);
      if (img.file) fd.append('images', img.file);
    });


    // 根據 condition 選擇後端路由
    const base = 'http://localhost:8000';
    const endpoint = productData.condition === 'new'
      ? '/get/new-products'
      : '/get/my-second-products';
    const url = modalState === 'Edit'
      ? `${base}${endpoint}/${productData.pid}`
      : `${base}${endpoint}`;
    const method = modalState === 'Edit' ? 'put' : 'post';

    console.log('Request:', method.toUpperCase(), url);
    for (let [k, v] of fd.entries()) console.log('FormData', k, v);

    try {
      const res = await axios[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-UID': productData.uid }
      });
      console.log('Response:', res.status, res.data);
      alert(modalState === 'Add' ? '新增成功' : '修改成功');
      if (modalState === 'Edit') onEdit && onEdit(productData);
      else window.location.reload();
      close();
    } catch (err) {
      console.error('Upload failed:', err.response?.status, err.response?.data || err.message);
      alert(`上傳失敗 [${err.response?.status}]: ${err.response?.data?.error || err.message}`);
    }
  };



  render() {
    const attrLabels = {
      brand: '品牌',
      pattern: '樣式',
      name: '名稱',
      model: '型號',
      buydate: '購入時間',
      new_level: '保存狀況',
      size: '尺寸',
      color: '顏色',
      weight: '重量'
    };
    const { modalState, productData } = this.state;
    const { close } = this.props;
    const readOnly = modalState === 'Find';

    const attrKeys = Object.keys(productData.attribute)
      .filter(key => !(productData.condition === 'new' && key === 'new_level'));

    const allFields = [
      {
        key: 'status', label: '商品狀態', type: 'select', options: [
          { value: '1', label: '上架' },
          { value: '0', label: '下架' }
        ]
      },
      { key: 'pd_name', label: '商品名稱', type: 'text' },
      { key: 'price', label: '價格', type: 'number' },
      { key: 'description', label: '描述', type: 'textarea' },
      { key: 'pet_type', label: '寵物類型', type: 'select', options: ['dog', 'cat', 'bird', 'mouse'] },
      { key: 'categories', label: '分類', type: 'select', options: ['pet_food', 'complementary_food', 'snacks', 'Health_Supplements', 'Living_Essentials', 'toys'] },
      { key: 'city', label: '城市', type: 'text' },
      { key: 'district', label: '區域', type: 'text' },
      {
        key: 'new_level', label: '新舊程度', type: 'select', options: [
          { value: '5', label: '全新' },
          { value: '4', label: '近新' },
          { value: '3', label: '普通' },
          { value: '2', label: '使用痕跡' },
          { value: '1', label: '明顯磨損' }
        ]
      },
      { key: 'stock', label: '庫存數量', type: 'number' }
    ];

    const fieldsToShow = allFields.filter(f => {
      if (productData.condition === 'new') {
        return !['city', 'district', 'new_level'].includes(f.key);
      }
      return true;
    });

    const optionLabels = {
      dog: '狗狗', cat: '貓咪', bird: '鳥類', mouse: '鼠類',
      pet_food: '飼料', complementary_food: '副食', snacks: '零食',
      Health_Supplements: '保健食品', Living_Essentials: '生活家居', toys: '玩具'
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '70vh' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalState === 'Add' ? '上架商品' : modalState === 'Edit' ? '編輯商品' : '查看商品'}
              </h5>
              {/* <button type="button" className="btn-close p-2" onClick={close} /> */}
            </div>
            <div className="modal-body">
              {fieldsToShow.map(cfg => {
                const val = productData[cfg.key];
                return (
                  <div className="form-group mb-2" key={cfg.key}>
                    <label>{cfg.label}</label>
                    {cfg.type === 'textarea' ? (
                      <textarea name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly} />
                    ) : cfg.type === 'select' ? (
                      <select name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly}>
                        <option value="">請選擇</option>
                        {cfg.options.map(opt => {
                          const value = typeof opt === 'string' ? opt : opt.value;
                          const label = typeof opt === 'string' ? optionLabels[opt] || opt : opt.label;
                          return <option key={value} value={value}>{label}</option>;
                        })}
                      </select>
                    ) : (
                      <input type={cfg.type} name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly} />
                    )}
                  </div>
                );
              })}
              <hr />
              <h5>商品屬性</h5>
              {Object.keys(productData.attribute)
                .filter(key => !(productData.condition === 'new' && key === 'new_level'))
                .map(attr => (
                  <div className="form-group mb-2" key={attr}>
                    <label>{attrLabels[attr] || attr}</label>
                    <input
                      type="text"
                      name={`attribute.${attr}`}
                      className="form-control"
                      value={productData.attribute[attr]}
                      onChange={this.handleAttrChange}
                      disabled={readOnly}
                    />
                  </div>
                ))}
              <hr />
              <h5>商品圖片與描述</h5>
              {productData.images.map((img, idx) => (
                <div className="d-flex mb-3" key={idx}>
                  <div style={{ width: 80, height: 80, marginRight: 8 }}>
                    {img.file ?
                      <img src={URL.createObjectURL(img.file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : img.img_path ?
                        <img src={img.img_path.startsWith('http') ? img.img_path : `http://localhost:8000${img.img_path}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span className="text-muted">無圖</span>
                    }
                  </div>
                  <div className="flex-grow-1">
                    <input type="hidden" name="slot[]" value={`slot${idx}`} />
                    <input type="hidden" name="image_id[]" value={img.id || ''} />
                    <input type="file" name={`images[${idx}]`} accept="image/*" className=" form-control-sm mb-1" onChange={e => this.uploadImageAtIndex(idx, e)} disabled={readOnly} />
                    <input type="text" name="img_value[]" className="form-control form-control-sm" placeholder="輸入圖片描述" value={img.img_value} onChange={e => this.handleValueChange(idx, e)} disabled={readOnly} />
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className={styles.btncancel} onClick={close}>取消</button>
              {!readOnly && <button className={styles.btnsubmit} onClick={this.handleSubmit}>儲存</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}