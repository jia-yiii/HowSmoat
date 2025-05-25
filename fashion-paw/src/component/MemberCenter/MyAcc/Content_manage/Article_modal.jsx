import React, { Component } from 'react'
import axios from 'axios'
import styles from './Article_manage.module.css'

export default class Article_modal extends Component {
  constructor(props) {
    super(props)
    // normalize initial form
    const parseSections = v => Array.isArray(v)
      ? v
      : typeof v === 'string'
        ? (() => { try { return JSON.parse(v) } catch { return [] } })()
        : []

    const initial = {
      ...(props.article || {}),
      ArticleID: props.article?.ArticleID || null,
      article_type: props.article?.article_type || '',
      product_category: props.article?.product_category || '',
      sections: parseSections(props.article?.sections)
    }
    if (typeof initial.banner_URL === 'string' && initial.banner_URL) {
      initial.banner_URL_preview = initial.banner_URL
    }
    this.state = { form: initial }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.mode !== prevProps.mode ||
      this.props.article?.ArticleID !== prevProps.article?.ArticleID
    ) {
      const parseSections = v => Array.isArray(v)
        ? v
        : typeof v === 'string'
          ? (() => { try { return JSON.parse(v) } catch { return [] } })()
          : []
      const updated = {
        ...(this.props.article || {}),
        ArticleID: this.props.article?.ArticleID || null,
        article_type: this.props.article?.article_type || '',
        product_category: this.props.article?.product_category || '',
        sections: parseSections(this.props.article?.sections)
      }
      if (typeof updated.banner_URL === 'string' && updated.banner_URL) {
        updated.banner_URL_preview = updated.banner_URL
      }
      this.setState({ form: updated })
    }
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState(s => ({ form: { ...s.form, [name]: value } }))
  }

  handleFileChange = e => {
    const { name, files } = e.target
    if (!files.length) return
    const file = files[0]
    const url = URL.createObjectURL(file)
    this.setState(s => ({ form: { ...s.form, [name]: file, [`${name}_preview`]: url } }))
  }

  handleSectionChange = (idx, field, value) => {
    this.setState(s => {
      const secs = Array.isArray(s.form.sections) ? [...s.form.sections] : []
      secs[idx] = { ...secs[idx], [field]: value }
      return { form: { ...s.form, sections: secs } }
    })
  }

  handleSubmit = async () => {
    const { mode, onSuccess, close } = this.props;
    const { form } = this.state;
    if (mode === 'Edit' && !form.ArticleID) {
      alert('找不到文章 ID，無法更新');
      return;
    }
    const API_BASE = 'http://localhost:8000';
    const fd = new FormData();
    ['title', 'intro', 'pet_type', 'product_category', 'article_type'].forEach(key => {
      fd.append(key, form[key] || '');
    });
    const sections = Array.isArray(form.sections) ? form.sections : [];
    fd.append(
      'sections',
      JSON.stringify(
        sections.map(sec => ({
          heading: sec.heading || '',
          body: sec.body || '',
          image_url: typeof sec.image_url === 'string' ? sec.image_url : ''
        }))
      )
    );
    sections.forEach((sec, idx) => {
      if (sec.image_url instanceof File) {
        fd.append(`section_image_${idx}`, sec.image_url);
      }
    });
    if (form.banner_URL instanceof File) {
      fd.append('banner_URL', form.banner_URL);
    }
    const path =
      mode === 'Add'
        ? '/api/create/article'
        : `/api/update/article/${form.ArticleID}`;
    try {
      await axios({
        method: mode === 'Add' ? 'post' : 'put',
        url: `${API_BASE}${path}`,
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(mode === 'Add' ? '新增成功' : '儲存成功');
      onSuccess?.();
      close();
    } catch (err) {
      console.error('儲存文章失敗：', err);
      alert('儲存文章失敗，請稍後再試');
    }
  }

  render() {
    const { mode, close } = this.props
    const { form } = this.state
    const readOnly = mode === 'Find'
    const API_BASE = 'http://localhost:8000'
    const bannerSrc = form.banner_URL_preview
      ? form.banner_URL_preview
      : form.banner_URL
      ? `${API_BASE}${form.banner_URL}`
      : ''
    return (
      <div className="modal show fade d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === 'Add' ? '新增文章' : mode === 'Edit' ? '編輯文章' : '查看文章'}
              </h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>
            <div className="modal-body">
              {/* Banner */}
              <div className="mb-3">
                <label>Banner 圖片</label>
                <input
                  type="file"
                  name="banner_URL"
                  className="form-control"
                  onChange={this.handleFileChange}
                  disabled={readOnly}
                />
                {bannerSrc && <img src={bannerSrc} alt="banner" style={{ width: '100%', marginTop: 8 }} />}
              </div>
              {/* 標題 */}
              <div className="mb-3">
                <label>標題</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={form.title || ''}
                  onChange={this.handleChange}
                  readOnly={readOnly}
                />
              </div>
              {/* 摘要 */}
              <div className="mb-3">
                <label>摘要</label>
                <textarea
                  name="intro"
                  className="form-control"
                  value={form.intro || ''}
                  onChange={this.handleChange}
                  readOnly={readOnly}
                />
              </div>
              {/* 寵物類型 */}
              <div className="mb-3">
                <label>寵物類型</label>
                <select
                  name="pet_type"
                  className="form-select"
                  value={form.pet_type || ''}
                  onChange={this.handleChange}
                  disabled={readOnly}
                >
                  <option value="">-- 請選擇 --</option>
                  <option value="dog">狗狗</option>
                  <option value="cat">貓咪</option>
                  <option value="bird">鳥類</option>
                  <option value="mouse">鼠類</option>
                </select>
              </div>
              {/* 分類 */}
              <div className="mb-3">
                <label>文章分類</label>
                <select
                  name="product_category"
                  className="form-select"
                  value={form.product_category || ''}
                  onChange={this.handleChange}
                  disabled={readOnly}
                >
                  <option value="">-- 請選擇 --</option>
                  <option value="pet food">飼料</option>
                  <option value="complementary food">副食</option>
                  <option value="snacks">零食</option>
                  <option value="Health Supplements">保健食品</option>
                  <option value="Living Essentials">生活家居</option>
                  <option value="toys">玩具</option>
                </select>
              </div>
              {/* 文章類型 */}
              <div className="mb-3">
                <label>文章類型</label>
                <select
                  name="article_type"
                  className="form-select"
                  value={form.article_type || ''}
                  onChange={this.handleChange}
                  disabled={readOnly}
                  required
                >
                  <option value="">-- 請選擇 --</option>
                  <option value="health_check">健康檢查</option>
                  <option value="pet_feeding">飼養知識</option>
                </select>
              </div>
              <hr />
              {/* Sections */}
              <h6>Sections</h6>
              {(Array.isArray(form.sections) ? form.sections : []).map((sec, i) => {
                const secSrc = sec.image_url_preview
                  ? sec.image_url_preview
                  : sec.image_url
                  ? `${API_BASE}${sec.image_url}`
                  : ''
                return (
                  <div key={i} className="mb-3 border p-2">
                    <div className="mb-2">
                      <label>Section Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sec.heading || ''}
                        onChange={e => this.handleSectionChange(i, 'heading', e.target.value)}
                        readOnly={readOnly}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Section Body</label>
                      <textarea
                        className="form-control"
                        value={sec.body || ''}
                        onChange={e => this.handleSectionChange(i, 'body', e.target.value)}
                        readOnly={readOnly}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Section 圖片</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={e => {
                          const file = e.target.files[0]
                          const url = URL.createObjectURL(file)
                          this.handleSectionChange(i, 'image_url', file)
                          this.handleSectionChange(i, 'image_url_preview', url)
                        }}
                        disabled={readOnly}
                      />
                      {secSrc && <img src={secSrc} alt="sec" style={{ width: '100%', marginTop: 4 }} />}
                    </div>
                  </div>
                )
              })}
              {!readOnly && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => this.setState(s => ({
                    form: { ...s.form, sections: [...(s.form.sections || []), { heading: '', body: '', image_url: '' }] }
                  }))}
                >
                  新增 Section
                </button>
              )}
            </div>
            <div className="modal-footer">
              <button className={styles.btncancel} onClick={close}>取消</button>
              {!readOnly && (
                <button className={styles.btnsubmit} onClick={this.handleSubmit}>
                  {mode === 'Add' ? '新增' : '儲存'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
