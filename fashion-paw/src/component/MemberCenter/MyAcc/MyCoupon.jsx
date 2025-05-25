import React, { Component } from 'react';
import cookie from "js-cookie";
import axios from 'axios';
import styles from './MyCoupon.module.css'



class MyCoupon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coupon: [
                {
                    coupon_id: 1,
                    discount_ratio: 0.88,
                    coupon_code: "2025LOVEPET",
                    create_at: "2025*05*01",
                    overdate: "2025*06-01",
                    description: ""
                },
                {
                    coupon_id: 1,
                    discount_ratio: 0.88,
                    coupon_code: "2025LOVEPET",
                    create_at: "2025*05*01",
                    overdate: "2025*06-01",
                    description: ""
                },
                {
                    coupon_id: 1,
                    discount_ratio: 0.88,
                    coupon_code: "2025LOVEPET",
                    create_at: "2025*05*01",
                    overdate: "2025*06-01",
                    description: ""
                }
            ]
        }
    }

    getcoupon = () => {
        let uid = cookie.get("user_uid")

        axios.get(`http://localhost:8000/get/getcoupon/${uid}`).then((response) => {
            console.log("查詢成功:", response.data);

            this.setState({
                coupon: response.data
            })

        })
            .catch((error) => {
                console.error("查詢失敗:", error);
            });
    }


    componentDidMount() {
        this.getcoupon()
    }


    render() {
        let { coupon } = this.state
        return (
            <>
            <h4 style={{color:"#333"}}>我的優惠券</h4>
            <table className={`table table-striped ${styles.myCustomTable}`}>
                <thead className={styles.tableprimary}>
                    <tr>
                        <th>折扣</th>
                        <th>折扣碼</th>
                        <th>生效日</th>
                        <th>到期日</th>
                        <th>說明</th>
                    </tr>
                </thead>
                <tbody>
                    {coupon.map((cop, index) => {
                        return <>
                            <tr key={index}>
                                <td><h2>{cop.discount_ratio * 100}折</h2 ></td>
                                <td>{cop.coupon_code}</td>
                                <td>{new Date(cop.create_at).toLocaleDateString()}</td>
                                <td>{new Date(cop.overdate).toLocaleDateString()}</td>
                                <td>{cop.description}</td>
                            </tr>
                        </>
                    })}
                </tbody>
            </table>
            </>
        );
    }
}

export default MyCoupon;