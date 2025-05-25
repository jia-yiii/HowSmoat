import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

class Receipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedReceiptWay: '',
            phoneCarrier: '',
            companyTaxID: '',
            rememberCarrier: false,
            carrierError: '',
        };
    }

    async componentDidMount() {
        try {
            const uid = cookie.get("user_uid");
            // console.log(uid)
            if (uid) {
                const res = await axios.get(`http://localhost:8000/get/userinfo/${uid}`);
                // console.log(res)
                const device = res.data.device || '';
                this.setState({ phoneCarrier: device });
            }
        } catch (err) {
            console.error('❌ 載入用戶手機載具失敗', err);
        }
    }

    handleRadioChange = (e) => {
        const selectedReceiptWay = e.target.id;
        this.setState({ selectedReceiptWay }, this.sendToParent);
    }

    handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        this.setState({ [name]: newValue }, this.sendToParent);
    }

    sendToParent = () => {
        const { selectedReceiptWay, phoneCarrier, rememberCarrier, companyTaxID } = this.state;

        let receiptStr = '';
        switch (selectedReceiptWay) {
            case 'memberReceipt':
                receiptStr = '會員載具';
                break;
            case 'phoneReceipt':
                receiptStr = `手機載具: ${phoneCarrier}`;
                break;
            case 'companyReceipt':
                receiptStr = `公司發票: ${companyTaxID}`;
                break;
            case 'DonateInvoice':
                receiptStr = '捐贈發票';
                break;
            default:
                receiptStr = '';
        }

        if (this.props.onChange) {
            this.props.onChange({
                type: selectedReceiptWay,
                value: receiptStr,
                phoneCarrier,
                rememberCarrier,
            });
        }
    }

    render() {
        const { selectedReceiptWay, phoneCarrier, rememberCarrier, companyTaxID, carrierError } = this.state;

        return (
            <div className='px-4 py-2'>
                <input name="receiptWay" type="radio" id="memberReceipt" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="memberReceipt">會員載具</label><br />

                <input name="receiptWay" type="radio" id="phoneReceipt" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="phoneReceipt">手機載具</label><br />
                {selectedReceiptWay === "phoneReceipt" && (
                    <div className="px-3">
                        <div className="d-flex align-items-center">
                            <input
                                name="phoneCarrier"
                                type="text"
                                value={phoneCarrier}  // ✅ 直接顯示完整字串
                                placeholder="請輸入手機條碼7碼"
                                maxLength={8}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/^\/+/, ''); // 移除多個斜線
                                    const limitedRaw = raw.slice(0, 7);
                                    const fullCarrier = '/' + limitedRaw;

                                    let errorMsg = '';
                                    if (limitedRaw.length > 0 && limitedRaw.length < 7) {
                                        errorMsg = '手機條碼需為 7 碼';
                                    }

                                    this.setState({
                                        phoneCarrier: fullCarrier,
                                        carrierError: errorMsg
                                    }, this.sendToParent);
                                }}
                            />
                            {carrierError && <div className="text-danger mt-1">{carrierError}</div>}
                        </div>
                        <div>
                            <input
                                className='mx-2'
                                type="checkbox"
                                name="rememberCarrier"
                                id='rememberCarrier'
                                checked={rememberCarrier}
                                onChange={this.handleInputChange}
                            />
                            <label className='ps-1' htmlFor='rememberCarrier'> 更新我的載具</label>
                        </div>
                    </div>
                )}

                <input name="receiptWay" type="radio" id="companyReceipt" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="companyReceipt">公司發票</label><br />
                {selectedReceiptWay === "companyReceipt" && (
                    <div className="px-3">
                        <input
                            name="companyTaxID"
                            type="text"
                            value={companyTaxID}
                            placeholder="請輸入統一編號"
                            onChange={this.handleInputChange}
                        />
                    </div>
                )}

                <input name="receiptWay" type="radio" id="DonateInvoice" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="DonateInvoice">捐贈發票</label>
            </div>
        );
    }
}

export default Receipt;