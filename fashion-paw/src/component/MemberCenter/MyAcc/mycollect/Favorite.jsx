import React, { Component } from 'react';
import cookie from "js-cookie";
import axios from 'axios';
import AddToMyFavorite from 'component/share/AddToMyFavorite';
import styles from './Favorite.module.css'

class FavoriteCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    handleShow = () => {
        // console.log(this.props.cid);

        this.setState({ show: true });
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    handleConfirmRemove = () => {
        this.setState({ show: false });
        let uid = cookie.get("user_uid")
        let cid = this.props.cid

        console.log(uid);
        console.log(this.props.cid);


        axios.post(`http://localhost:8000/post/deletecollect/${uid}/${cid}`).then((response) => {
            console.log("刪除成功:", response.data);

            // 刪除成功後重新獲取資料
            this.props.getcollect();
        })
            .catch((error) => {
                console.error("刪除失敗:", error);
            });

        // this.props.onRemove();
        // this.props.getcollect();
    }

    render() {
        const { img, pd_name, price, id, cid } = this.props;
        const { show } = this.state;

        return (
            <>
                <div className="col-12 col-sm-4 col-md-4 col-lg-3 card shadow-sm mr-4 my-3" style={{ width: '8rem', position: 'relative' }}>
                    <img src={img} className="card-img-top img-fluid" alt={pd_name} />
                    <div className="card-body">
                        <h5 className={styles.pdname}>{pd_name}</h5>
                        <p className={styles.price}>NT$ {price}</p>
                        <div className={styles.linkbox}>
                            <a className={styles.pdbtn} href={`/product/${id}`}>
                                查看商品
                            </a>
                            <AddToMyFavorite type="text" onClick={this.handleShow} isFavorite={true} />
                        </div>
                    </div>
                </div>

                {show && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">


                                <div className="modal-body">
                                    <h5>確認取消收藏</h5>
                                    <p>你確定要將「{pd_name}」從收藏中移除嗎？</p>
                                    <div className={styles.closebtn}>
                                        <button className={styles.btncancel} onClick={this.handleClose}>關閉</button>
                                        <button className={styles.btndel} onClick={this.handleConfirmRemove}>確定移除</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </>
        );
    }
}

export default FavoriteCard;
