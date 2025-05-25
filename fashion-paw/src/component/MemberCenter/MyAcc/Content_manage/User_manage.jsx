import React, { Component } from 'react';
import Pagination from './Page_manage';
import axios from 'axios';
import styles from './User_manage.module.css'

class User_manage extends Component {
  state = {
    show: false,
    thisIndex: 0,
    currentPage: 1,
    editinguser: {
      uid: '',
      username: '',
      email: '',
      fullname: '',
      birthday: '',
      power: '',
      last_time_login: '',
      aboutme: '',
      device: '',
      photo: null,
    },
    backuserinfo: [],
  };

  async componentDidMount() {
    try {
      const { data } = await axios.get('http://localhost:8000/get/back-userinfo');
      const backuserinfo = data.map(user => ({
        ...user,
        birthday: new Date(user.birthday).toLocaleDateString(),
        last_time_login: new Date(user.last_time_login).toLocaleString(),
        photo: user.photo
          ? URL.createObjectURL(
            new Blob([new Uint8Array(user.photo.data)], { type: 'image/webp' })
          )
          : null,
      }));
      this.setState({ backuserinfo });
    } catch (err) {
      console.error('讀取失敗：', err);
    }
  }

  componentWillUnmount() {
    this.state.backuserinfo.forEach(u => {
      if (u.photo && u.photo.startsWith('blob:')) URL.revokeObjectURL(u.photo);
    });
  }

  handlePageChange = page => this.setState({ currentPage: page });

  toggleModal = () => this.setState(prev => ({ show: !prev.show }));

  EditUser = index => {
    const editinguser = { ...this.state.backuserinfo[index] };
    this.setState({ show: true, thisIndex: index, editinguser });
  };

  handleDelete = async uid => {
    if (!window.confirm('確定要刪除這位使用者？')) return;
    try {
      await axios.delete(`http://localhost:8000/get/back-userinfo/${uid}`);
      this.setState(prev => ({
        backuserinfo: prev.backuserinfo.filter(u => u.uid !== uid),
      }));
      alert('刪除成功');
    } catch (err) {
      console.error(err);
      alert('刪除失敗');
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { editinguser, thisIndex, backuserinfo } = this.state;
    try {
      await axios.put(
        `http://localhost:8000/get/back-userinfo/${editinguser.uid}`,
        editinguser
      );
      const updated = [...backuserinfo];
      updated[thisIndex] = { ...editinguser };
      this.setState({ backuserinfo: updated, show: false });
      alert('更新成功');
    } catch (err) {
      console.error(err);
      alert('更新失敗');
    }
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(prev => ({
      editinguser: { ...prev.editinguser, [name]: value },
    }));
  };

  handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const photo = URL.createObjectURL(file);
      this.setState(prev => ({ editinguser: { ...prev.editinguser, photo } }));
    }
  };

  Renderpower = power => ({ developer: '開發者', seller: '賣家', buyer: '買家' }[power]);

  render() {
    const { backuserinfo, show, editinguser, currentPage } = this.state;
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentuser = backuserinfo.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <table className={`table table-striped mt-5 ${styles.tablestriped}`}>
          <thead className={styles.tableprimary}>
            <tr>
              <th>使用者編號</th>
              <th>使用者暱稱</th>
              <th>姓名</th>
              <th>生日</th>
              <th>上次登入</th>
              <th>網站權限</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentuser.map((user, idx) => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.username}</td>
                <td>{user.fullname}</td>
                <td>{user.birthday}</td>
                <td>{user.last_time_login}</td>
                <td>{this.Renderpower(user.power)}</td>
                <td>
                  <button className={styles.btnsubmit} onClick={() => this.EditUser(startIndex + idx)}>
                    編輯
                  </button>
                  <button className={styles.btndel} onClick={() => this.handleDelete(user.uid)}>
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          totalItems={backuserinfo.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />

        {show && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">編輯會員資料</h5>
                  {/* <button type="button" className="btn-close" onClick={this.toggleModal}></button> */}
                </div>
                <form onSubmit={this.handleSubmit}>
                  <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* 使用者名稱 */}
                    <div className="mb-3">
                      <label className="form-label">使用者名稱</label>
                      <input type="text" className="form-control" name="username" value={editinguser.username} onChange={this.handleChange} />
                    </div>
                    {/* 電子郵件 */}
                    <div className="mb-3">
                      <label className="form-label">電子郵件</label>
                      <input type="email" className="form-control" name="email" value={editinguser.email} onChange={this.handleChange} />
                    </div>
                    {/* 全名 */}
                    <div className="mb-3">
                      <label className="form-label">全名</label>
                      <input type="text" className="form-control" name="fullname" value={editinguser.fullname} onChange={this.handleChange} />
                    </div>
                    {/* 生日 */}
                    <div className="mb-3">
                      <label className="form-label">生日</label>
                      <input type="date" className="form-control" name="birthday" value={editinguser.birthday} onChange={this.handleChange} />
                    </div>
                    {/* 權限 */}
                    <div className="mb-3">
                      <label className="form-label">權限</label>
                      <select className="form-control" name="power" value={editinguser.power} onChange={this.handleChange}>
                        <option value="developer">開發者</option>
                        <option value="seller">賣家</option>
                        <option value="buyer">買家</option>
                      </select>
                    </div>
                    {/* 上次登入 */}
                    <div className="mb-3">
                      <label className="form-label">上次登入時間</label>
                      <input type="text" className="form-control" name="last_time_login" value={editinguser.last_time_login} disabled />
                    </div>
                    {/* 關於我 */}
                    <div className="mb-3">
                      <label className="form-label">關於我</label>
                      <textarea className="form-control" name="aboutme" value={editinguser.aboutme} onChange={this.handleChange}></textarea>
                    </div>
                    {/* 發票載具 */}
                    <div className="mb-3">
                      <label className="form-label">發票載具</label>
                      <input type="text" className="form-control" name="device" value={editinguser.device} onChange={this.handleChange} />
                    </div>
                    {/* 大頭照 */}
                    <div className={styles.profilephoto}>
                      <label className="form-label">大頭照</label>
                      <input type="file" className="" onChange={this.handlePhotoChange} />
                      {editinguser.photo && <img src={editinguser.photo} className={styles.headphoto} alt="大頭照" />}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className={styles.btncancel} onClick={this.toggleModal}>取消</button>
                    <button type="submit" className={styles.btnsubmit}>儲存變更</button>

                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default User_manage;
