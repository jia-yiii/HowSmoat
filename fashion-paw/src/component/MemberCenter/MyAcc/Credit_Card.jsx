import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Credit_Card_item from './credit_card/Credit_card_item';
import cookie from "js-cookie";
import axios from 'axios';
import styles from './Credit_Card.module.css'





class Credit_Card extends Component {
    constructor(props) {
        super(props)
        this.cardnumber = React.createRef();
        this.yuukou = React.createRef();
        this.state = {
            creditCards: [],
            showModal: false,
            card: [
                {
                    card_num: "5500 0000 0000 0000",
                    holder: "HENRY KOO",
                    expiry: "05/33"
                },
                {
                    card_num: "4000 0000 0000 0001",
                    holder: "HENRY KO",
                    expiry: "05/33"
                },
                {
                    card_num: "5500 0000 0000 0000",
                    holder: "HENRY K",
                    expiry: "05/43"
                }
            ]
        }
    }

    fetchCards = () => {
        const uid = cookie.get("user_uid");
        axios.get(`http://localhost:8000/get/creditcard/${uid}`)
        .then(response => {
            const newCards = response.data;
            console.log(response.data);
            
            this.setState({ card: response.data });
        }).catch(error => {
            console.error("發送請求錯誤:", error);
        });
    }









    componentDidMount() {
        this.fetchCards();
    }
    //去資料庫抓資料
    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
        console.log(this.state.creditCards);
        
    }

    deletecard = (index) => {//連接資料庫刪除

        console.log(index);
        axios.post(`http://localhost:8000/post/deletecard/${index}`)
        .then((response) => {
            console.log("刪除成功:", response.data);
            
            // 刪除成功後重新獲取資料
            this.fetchCards();
        })
        .catch((error) => {
            console.error("刪除失敗:", error);
        });
        
        
    }
    // const newCards = [...this.state.card];
    // newCards.splice(index, 1); // 刪除指定位置的卡
    // this.setState({ card: newCards });

    addnewcard = () => {
        const uid = encodeURIComponent(cookie.get("user_uid"));
        console.log(this.yuukou.current.value);
        console.log(this.cardnumber.current.value);
        const newcardnumber = encodeURIComponent(this.yuukou.current.value)
        const moon = encodeURIComponent(this.cardnumber.current.value)
        axios.post(`http://localhost:8000/post/newcard/${newcardnumber}/${moon}/${uid}`)
        .then((response) => {
            console.log("建立成功:");
            
            // 刪除成功後重新獲取資料
            this.fetchCards();
        })
        .catch((error) => {
            console.error("建立失敗:", error);
        });
    }

 


    render() {
        const { showModal, card } = this.state;
        

        return (
            <>
                <h4 style={{color:"#333"}}>我的信用卡{this.state.creditCards && this.state.creditCards[0] && this.state.creditCards[0].credit_num}</h4>
                <div key={card.cid}>
                    <p >{card.cid}</p>
                </div>
                <button className={styles.btnadd} onClick={this.toggleModal}>新增信用卡</button>
                {card.map((card_item, index) => {
                    console.log(card_item.id);
                    
                    return <Credit_Card_item delete={() => this.deletecard(card_item.id)} key={index} card={card_item} />
                })}

                {/* 下面是編輯信用卡 */}
                {showModal && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <form action="">
                                    <div className="modal-header">
                                        <h5 className="modal-title">新增信用卡</h5>
                                        <button type="button" className="close btn" onClick={this.toggleModal}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {/* <div className="form-group">
                                            <label>持卡人:</label>
                                            <input type="text" className="form-control" required />
                                        </div> */}

                                        <div className="form-group">
                                            <label>信用卡卡號:</label>
                                            <input type="text"  className="form-control" required 
                                            ref={this.cardnumber}/>
                                        </div>
                                        <div className="form-group">
                                            <label>有效日期:</label>
                                            <input type="text" placeholder='MM/YY'  className="form-control" required 
                                            ref={this.yuukou}/>
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className={styles.btncancel} onClick={this.toggleModal}>取消</button>
                                        <input type="submit" className={styles.btnsubmit} value="確認" onClick={this.addnewcard} />
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

export default Credit_Card;


