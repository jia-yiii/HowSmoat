import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from "js-cookie";
import styles from './Sidebar.module.css'

class Sidebar extends Component {
    state = {
        list: [
            { link: "profile", content: "個人檔案", auth: 1 },
            { link: "orders", content: "購物紀錄", auth: 1 },
            { link: "credit-card", content: "綁定信用卡", auth: 1 },
            { link: "mycollect", content: "我的收藏", auth: 1 },
            { link: "mycoupon", content: "我的優惠券", auth: 1 },
            { link: "myAddress", content: "我的地址", auth: 1 },
            { link: "manage-market", content: "管理賣場", auth: 2 },
            { link: "Content-manage", content: "後臺管理", auth: 3 }
        ]
    };

    // 根據用戶的權限設置菜單列表
    setListBasedOnPower = (userPower) => {
        let list = [];
        switch (userPower) {
            case 'seller':
                list = [
                    { link: "profile", content: "個人檔案", auth: 1 },
                    { link: "orders", content: "購物紀錄", auth: 1 },
                    { link: "credit-card", content: "綁定信用卡", auth: 1 },
                    { link: "mycollect", content: "我的收藏", auth: 1 },
                    { link: "mycoupon", content: "我的優惠券", auth: 1 },
                    { link: "myAddress", content: "我的地址", auth: 1 },
                    { link: "manage-market", content: "管理賣場", auth: 2 }
                ];
                break;
            case 'buyer':
                list = [
                    { link: "profile", content: "個人檔案", auth: 1 },
                    { link: "orders", content: "購物紀錄", auth: 1 },
                    { link: "credit-card", content: "綁定信用卡", auth: 1 },
                    { link: "mycollect", content: "我的收藏", auth: 1 },
                    { link: "mycoupon", content: "我的優惠券", auth: 1 },
                    { link: "myAddress", content: "我的地址", auth: 1 }
                ];
                break;
            case 'developer':
                list = [
                    { link: "profile", content: "個人檔案", auth: 1 },
                    { link: "orders", content: "購物紀錄", auth: 1 },
                    { link: "credit-card", content: "綁定信用卡", auth: 1 },
                    { link: "mycollect", content: "我的收藏", auth: 1 },
                    { link: "mycoupon", content: "我的優惠券", auth: 1 },
                    { link: "myAddress", content: "我的地址", auth: 1 },
                    { link: "manage-market", content: "管理賣場", auth: 2 },
                    { link: "Content-manage", content: "後臺管理", auth: 3 }
                ];
                break;
            default:
                list = []; // 無效的權限返回空的菜單列表
                break;
        }
        this.setState({ list });
    };

    // 组件加载时根据cookie里的user_power设置菜单列表
    componentDidMount() {
        const userPower = cookie.get("user_power"); // 從cookie中獲取user_power
        if (userPower) {
            this.setListBasedOnPower(userPower); // 根據user_power設置菜單
        }
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <ul className="list-unstyled">
                    {this.state.list.map((obj, index) => {
                        return (
                            <li key={index} className={styles.btn}>
                                <Link to={`/MemberCenter/${obj.link}`}>{obj.content}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default Sidebar;
