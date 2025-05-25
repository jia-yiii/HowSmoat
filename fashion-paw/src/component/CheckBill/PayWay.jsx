import React, { Component } from 'react';
// import linepayLogo from '../ProductDetailPage/image/LINEPayLogo.png';
// import jkoLogo from '../ProductDetailPage/image/jkopayLogo.webp';
// import PayPalLogo from '../ProductDetailPage/image/PayPalLogo.png';

class PayWay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPayWay: "",
            installmentOption: "",
            thirdPartyOption: ""
        };
    }

    payWayChange = (e) => {
        this.setState({
            selectedPayWay: e.target.id,
            installmentOption: "",
            thirdPartyOption: ""
        }, this.sendToParent);
    }

    handleInstallmentChange = (e) => {
        this.setState({ installmentOption: e.target.id }, this.sendToParent);
    }

    handleThirdPartyChange = (e) => {
        this.setState({ thirdPartyOption: e.target.id }, this.sendToParent);
    }

    sendToParent = () => {
        if (!this.props.onChange) return;
    
        // const { selectedPayWay, installmentOption, thirdPartyOption } = this.state;
        const { selectedPayWay } = this.state;
        let payLabel = "";
        let cardLast4 = "";
    
        switch (selectedPayWay) {
            case "onlinePay":
                payLabel = "線上付款";
                cardLast4 = ""; // 寫死等串綠界
                break;
            // case "installment":
            //     payLabel = `信用卡：分期付款（${installmentOption || "未選"}）`;
            //     cardLast4 = ""; // 分期也通常為信用卡，寫死等串綠界
            //     break;
            // case "thirdPartyPayment":
            //     const map = {
            //         linepay: "LINE PAY",
            //         streetpay: "街口支付",
            //         paypal: "PayPal"
            //     };
            //     payLabel = `行動支付：${map[thirdPartyOption] || "未選"}`;
            //     cardLast4 = ""; // 行動支付不填卡號
            //     break;
            case "cash":
                payLabel = "貨到付款";
                cardLast4 = "";
                break;
            default:
                payLabel = "未選擇";
                cardLast4 = "";
        }
    
        this.props.onChange({
            pay_way: payLabel,
            card_last4: cardLast4
        });
    };

    render() {
        // const { selectedPayWay } = this.state;

        return (
            <div className='px-4 py-2'>
                {/* 線上付款 */}
                <input name="payWay" type="radio" id="onlinePay" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="onlinePay">線上付款</label><br />
                {this.state.selectedPayWay === "onlinePay" && (
  <p className="paw-text-darkgreen  ms-4 mt-1">
    本網站採用綠界金流進行線上付款，可使用信用卡、第三方支付、ATM轉帳等多種方式。
  </p>
)}
{/* 
                信用卡分期付款 
                <input name="payWay" type="radio" id="installment" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="installment">信用卡：分期付款</label><br />
                {selectedPayWay === "installment" && (
                    <div className="px-3">
                        <input name="installmentOption" type="radio" id="3期" onChange={this.handleInstallmentChange} />
                        <label className='px-2' htmlFor="3期">3期</label><br />

                        <input name="installmentOption" type="radio" id="6期" onChange={this.handleInstallmentChange} />
                        <label className='px-2' htmlFor="6期">6期</label><br />

                        <input name="installmentOption" type="radio" id="12期" onChange={this.handleInstallmentChange} />
                        <label className='px-2' htmlFor="12期">12期</label><br />
                    </div>
                )}

                行動支付 
                <input name="payWay" type="radio" id="thirdPartyPayment" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="thirdPartyPayment">行動支付</label><br />
                {selectedPayWay === "thirdPartyPayment" && (
                    <div className="px-3">
                        <div className='d-flex align-items-center my-1'>
                            <input name="thirdPartyOption" type="radio" id="linepay" onChange={this.handleThirdPartyChange} />
                            <label className='px-2' htmlFor="linepay" style={{ width: "100px" }}><img src={linepayLogo} alt="LINEPAY" /></label><br />
                        </div>
                        <div className='d-flex align-items-center my-1'>
                            <input name="thirdPartyOption" type="radio" id="streetpay" onChange={this.handleThirdPartyChange} />
                            <label className='px-2' htmlFor="streetpay" style={{ width: "100px" }}><img src={jkoLogo} alt="JKOPay" /></label><br />
                        </div>
                        <div className='d-flex align-items-center my-1'>
                            <input name="thirdPartyOption" type="radio" id="paypal" onChange={this.handleThirdPartyChange} />
                            <label className='px-2' htmlFor="paypal" style={{ width: "100px" }}><img src={PayPalLogo} alt="PayPalLogo" /></label><br />
                        </div>
                    </div>
                )} */}

                {/* 貨到付款 */}
                <input name="payWay" type="radio" id="cash" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="cash">貨到付款</label>
            </div>
        );
    }
}

export default PayWay;