import React, { Component } from 'react';
import Order_detail from './Pd_detail';
import cookie from "js-cookie";
import axios from 'axios';
import styles from './Pd_list.module.css'


class PD_list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false,
            hasFetchedImage: false,
            order: {
                ...props.product,
                order_item: [],
                pd_img: "../media/default.jpg"
            }
        };
    }

    getorderitem = () => {
        axios.get(`http://localhost:8000/get/orderitems/${this.props.product.order_id}`).then((response) => {
            console.log("查詢成功:", response.data);

            this.setState(prevState => ({
                order: {
                    ...prevState.order,
                    order_item: response.data
                }
            }));


        })
            .catch((error) => {
                console.error("查詢失敗:", error);
            });
    }


    getorderitemfirstpig = () => {
        axios
            .get(`http://localhost:8000/get/orderitemfirstpig/${this.props.product.order_id}`)
            .then((response) => {
                console.log("主圖查詢成功:", response.data);
                this.setState(prevState => ({
                    order: {
                        ...prevState.order,
                        pd_img: response.data[0]?.pd_img || "../media/default.jpg"
                    }
                }));
            })
            .catch((error) => {
                console.error("主圖查詢失敗:", error);
            });
    };





    componentDidUpdate(prevProps) {
        const changed =
            this.props.product?.order_id !== prevProps.product?.order_id ||
            this.props.product?.display_order_num !== prevProps.product?.display_order_num;

        if (changed) {
            this.setState({ order: this.props.product }, () => {
                this.getorderitem();
                this.getorderitemfirstpig();
                console.log("更新 order 為:", this.props.product);
            });
        }
    }

    render() {
        if (!this.state.hasFetchedImage && this.props.product?.order_id) {
            this.getorderitemfirstpig();
            this.setState({ hasFetchedImage: true });
        }
        return (<>


            <div className="card p-4 mb-4 shadow-sm">
                <div className="row align-items-center">


                    {/* 訂單資訊 */}
                    <div className="col-md-8 col-12">
                        <div className="row">
                            <div className="col-md-3 col-6">
                                <strong>訂單編號</strong><br />
                                {'#' + this.state.order.ordernum}
                            </div>
                            <div className="col-md-2 col-6">
                                <strong>全新/二手</strong><br />
                                {(this.state.order.neworsecond == "new") ? "全新" : "二手"}
                            </div>
                            <div className="col-md-3 col-6">
                                <strong>訂單日期</strong><br />
                                {new Date(this.state.order.orderdate).toLocaleString('zh-TW', {
                                    timeZone: 'Asia/Taipei',
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                }).replace(/\//g, '-')}


                            </div>
                            <div className="col-md-2 col-6">
                                <strong>訂單狀態</strong><br />
                                已收到訂單
                            </div>
                            <div className="col-md-2 col-6">
                                <strong>總金額</strong><br />
                                {'$' + this.state.order.price}
                            </div>
                        </div>
                    </div>
                    {/* 商品圖片 */}
                    <div className="col-md-2 d-none d-md-block text-center">
                        <img src={this.state.order.pd_img} alt="商品圖片" className="img-fluid rounded" />
                    </div>
                    {/* 查看訂單明細 */}
                    <div className="col-md-2 col-8 text-md-end text-end mt-3 mt-md-0">
                        <button className={styles.btnadd} onClick={this.WatchDetail}>查看</button>
                    </div>
                </div>
            </div>

            {
                this.state.showDetail && (
                    <Order_detail close={this.WatchDetail} product={this.props.product} />
                )
            }
        </>
        );
    }
    WatchDetail = () => {
        const toggle = !this.state.showDetail;

        this.setState({ showDetail: toggle }, () => {
            if (toggle) {
                this.getorderitem();
                this.getorderitemfirstpig();
            }
        });
    };
}

export default PD_list;