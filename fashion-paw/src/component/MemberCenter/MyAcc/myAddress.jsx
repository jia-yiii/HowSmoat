import React, { Component } from 'react';
import MyAddressItem from './myAddress/myAddress_item';
import axios from 'axios';
import cookie from "js-cookie";
import styles from './myAddress.module.css'

class MyAddress extends Component {
    constructor(props) {
        super(props)
        this.inputaddressname = React.createRef();
        this.inputaddressphone = React.createRef();
        this.inputcity = React.createRef();
        this.inputdistrict = React.createRef();
        this.inputaddress = React.createRef();
    this.state = {
        showModal: false,
        Aid: "",
        address: [
            {
                city: "台中市",
                district: "清水區",
                address: "中山路100號",
                addressName: "王小名",
                addressPhone: "0426222758"
            },
            {
                city: "台北市",
                district: "木柵區",
                address: "木柵路一段123號",
                addressName: "陳大名",
                addressPhone: "0223456789"
            }
        ],
        newAddress: {
            city: '',
            district: '',
            address: '',
            addressName: '',
            addressPhone: ''
        },
        editingIndex: null  // 🔥 記錄現在是編輯第幾個
    };
    }

    getmysql(){
        const uid = cookie.get("user_uid")
        console.log(uid);
        axios.get(`http://localhost:8000/get/address/${uid}`)
        .then(response => {
            console.log(response.data);
            this.setState({ address:response.data })
        }).catch(error => {
            console.error("發送請求錯誤:", error);
        });
    }


    componentDidMount(){
        this.getmysql()
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
            newAddress: { city: '', district: '', address: '', addressName: '', addressPhone: '' },
            editingIndex: null
        });
    };

    toggleEdit = (Aid,index) => { 
        this.setState({
            Aid : Aid
        })
        // const Aid = index
        
        // const AdressName = this.inputaddressname.current.value


    // axios.post("/post/addressedit/:Aid/:AdressName/:AdressPhone/:City/:District/:address")



        console.log(index);
        


        // console.log(index);

        // axios.post(``)



        
        const addressToEdit = this.state.address[index];
        this.setState({
            showModal: true,
            newAddress: { ...addressToEdit },
            editingIndex: index
        });
    };

    uporcr(value){
        
        if (value === null || value === undefined){
            // this.editaddress()
            this.makenewaddress()
            
            
        }else{
            // this.makenewaddress()          
            this.editaddress()          
                   
        }
    }

    makenewaddress(){
        const uid = encodeURIComponent(cookie.get("user_uid"))
        const AdressName = encodeURIComponent(this.inputaddressname.current.value)
        const AdressPhone = encodeURIComponent(this.inputaddressphone.current.value)
        const City = encodeURIComponent(this.inputcity.current.value)
        const District = encodeURIComponent(this.inputdistrict.current.value)
        const address = encodeURIComponent(this.inputaddress.current.value)

        console.log(AdressName);
        console.log(AdressPhone);
        console.log(City);
        console.log(District);
        console.log(address);

        axios.post(`http://localhost:8000/post/makenewaddress/${uid}/${AdressName}/${AdressPhone}/${City}/${District}/${address}`)
        .then((response) => {
            console.log("新增成功:");
            
            
            this.getmysql();
        })
        .catch((error) => {
            console.error("新增失敗:", error);
        });
    }



    editaddress(){
        const Aid = encodeURIComponent(this.state.Aid)
        const AdressName = encodeURIComponent(this.inputaddressname.current.value)
        const AdressPhone = encodeURIComponent(this.inputaddressphone.current.value)
        const City = encodeURIComponent(this.inputcity.current.value)
        const District = encodeURIComponent(this.inputdistrict.current.value)
        const address = encodeURIComponent(this.inputaddress.current.value)
        
        console.log(Aid);
        console.log(AdressName);
        console.log(AdressPhone);
        console.log(City);
        console.log(District);
        console.log(address);
        
        axios.post(`http://localhost:8000/post/addressedit/${Aid}/${AdressName}/${AdressPhone}/${City}/${District}/${address}`)
        .then((response) => {
            console.log("修改成功:");
            
            
            this.getmysql();
        })
        .catch((error) => {
            console.error("修改失敗:", error);
        });
    }


    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            newAddress: {
                ...prevState.newAddress,
                [name]: value
            }
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { editingIndex, address, newAddress } = this.state;

        if (editingIndex === null) {
            //  新增模式
            this.setState({
                address: [...address, newAddress],
                showModal: false,
                newAddress: { city: '', district: '', address: '', addressName: '', addressPhone: '' }
            });
        } else {
            //  編輯模式
            const updatedAddress = [...address];
            updatedAddress[editingIndex] = newAddress;
            this.setState({
                address: updatedAddress,
                showModal: false,
                newAddress: { city: '', district: '', address: '', addressName: '', addressPhone: '' },
                editingIndex: null
            });
        }
    };

    deleteaddr = (index) => {
        // 設置 Aid
        this.setState({
            Aid: index
        }, () => {
            // 使用 setState 的回調函數，確保 Aid 更新完成後再執行 gotodelete
            this.gotodelete();
        });
    };


    gotodelete(){
        const Aid = this.state.Aid
        axios.post(`http://localhost:8000/post/deleteaddress/${Aid}`)
        .then((response) => {
            console.log("刪除成功:");
            this.getmysql();
        })
        .catch((error) => {
            console.error("刪除失敗:", error);
        });
    }




    render() {
        const { showModal, address, newAddress, editingIndex } = this.state;

        return (
            <>
                <h4 style={{color:"#333"}}>我的地址</h4>
                <button className={styles.btnadd} onClick={this.toggleModal}>新增</button>

                {address.map((addr_item, index) => (
                    <MyAddressItem
                        key={index}
                        addr={addr_item}
                        edit={() => this.toggleEdit(addr_item.Aid,index)}
                        delete={() => this.deleteaddr(addr_item.Aid)}
                    />
                ))}

                {showModal && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">{editingIndex === null ? "新增地址" : "編輯地址"}</h5>
                                        <button type="button" className="close btn" onClick={this.toggleModal}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>收件人姓名:</label>
                                            <input type="text" name="addressName" className="form-control" value={newAddress.addressName} onChange={this.handleInputChange} ref={this.inputaddressname} required />
                                        </div>
                                        <div className="form-group">
                                            <label>收件人電話:</label>
                                            <input type="text" name="addressPhone" className="form-control" value={newAddress.addressPhone} onChange={this.handleInputChange} ref={this.inputaddressphone} required />
                                        </div>
                                        <div className="form-group">
                                            <label>城市:</label>
                                            <input type="text" name="city" className="form-control" value={newAddress.city} onChange={this.handleInputChange} ref={this.inputcity} required />
                                        </div>
                                        <div className="form-group">
                                            <label>地區:</label>
                                            <input type="text" name="district" className="form-control" value={newAddress.district} onChange={this.handleInputChange} ref={this.inputdistrict} required />
                                        </div>
                                        <div className="form-group">
                                            <label>詳細地址:</label>
                                            <input type="text" name="address" className="form-control" value={newAddress.address} onChange={this.handleInputChange} ref={this.inputaddress} required />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className={styles.btncancel} onClick={this.toggleModal}>取消</button>
                                        <input type="submit" className={styles.btnsubmit} value={editingIndex === null ? "確認新增" : "確認修改"} onClick={()=>this.uporcr(editingIndex)} />
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

export default MyAddress;
