import React, { Component } from 'react';
import PD_list from './Product_list/Pd_list';
import cookie from "js-cookie";
import axios from 'axios';
class Orders extends Component {
    constructor(props) {
    super(props);
    this.state = {
        products: [
            {
                ordernum: "000000001",
                neworsecond: "new",
                orderdate: new Date().toLocaleDateString()+new Date().toLocaleTimeString(),
                orderstate: "已寄件",
                price: 2550,
                pd_img: "/media/member_center/catfood.jpg",
                order_item: [
                    {
                        pid: "1",
                        pd_name: "toys",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
                    },
                    {
                        pid: "2",
                        pd_name: "food",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
                    }
                ]
            },
            {
                ordernum: "000000002",
                neworsecond: "second",
                orderdate: new Date().toLocaleDateString()+new Date().toLocaleTimeString(),
                orderstate: "已寄件",
                price: 25500,
                pd_img: "/media/member_center/catfood.jpg",
                order_item: [
                    {
                        pid: "3",
                        pd_name: "health",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
                    },
                    {
                        pid: "4",
                        pd_name: "snacks",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
                    },
                    {
                        pid: "4",
                        pd_name: "snacks",
                        quantity: 2,
                        unit_price: 100,
                        img_path: "/media/member_center/catfood.jpg"
                    }
                ]
            }
        ]
    }
    }

    getorder=()=>{
        let uid = cookie.get("user_uid")

        axios.get(`http://localhost:8000/get/getorder/${uid}`).then((response) => {
            console.log("查詢成功:", response.data);
            console.log("前端收到幾筆訂單：", response.data.length);


            this.setState({
                products: response.data
            },()=>{
                console.log(this.state);
                
                
            })
            
           
        })
        .catch((error) => {
            console.error("查詢訂單失敗:", error);
        });
    }



    
    




    componentDidMount(){
        this.getorder()
    }



    render() {
        let { products } = this.state
        return (
            <div>
                <h4 style={{color:"#333"}}>購物紀錄</h4>
                {/* <label for="">搜尋</label>
                <input type="search" name="" id="" /> */}
                <div className="container mt-4">
                    {products?.map((pd, index) => {
                        return <PD_list key={index} product={pd} />

                    })}
                </div>
            </div>
        );
    }
}

export default Orders;