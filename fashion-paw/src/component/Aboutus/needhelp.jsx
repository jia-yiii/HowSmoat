import React, { Component } from 'react';
import style from './needhelp.module.css';

class Needhelp extends Component {
    constructor(props) {
        super(props);
        this.koufu = React.createRef();
        this.g1 = React.createRef();
        this.g2 = React.createRef();
        this.g3 = React.createRef();

        this.state = {
            showAppleBlock: true,
            showBananaBlock: false,
            showCatBlock: false,
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            answer5: '',
            answer6: '',
            answer7: '',
            answer8: '',
            answer9: '',
            quest1: 'Q：可以指定配送時間嗎？',
            quest2: 'Q：有哪些付款方式可以選擇？',
            quest3: 'Q：如果收到商品有問題，該怎麼處理？',
            quest4: 'Q：我有七天鑑賞期嗎？',
            quest5: 'Q：商品退回需要負擔運費嗎？',
            quest6: 'Q：收到的商品與網站描述不符，怎麼辦？',
            quest7: 'Q：接到自稱「好拾毛客服」來電，說我訂單異常，是真的嗎？',
            quest8: 'Q：我接到簡訊說我購買了高額商品，但我沒買，是怎麼回事？',
            quest9: 'Q：我收到一封 email，要我點進連結重新登入帳號？',
        }
    }

    apple = () => {
        this.setState({
            answer1: 'A： 目前無法指定配送時段，但您可於備註欄註明偏好時段，物流將盡量配合安排。',
            answer2: '',
            answer3: '',
        });
    };
    
    banana = () => {
        this.setState({
            answer1: '',
            answer2: 'A： 本店提供信用卡、LINE Pay與貨到付款等多種方式，請於結帳時選擇。',
            answer3: '',
        });
    };


    pieapple = () => {
        this.setState({
            answer1: '',
            answer2: '',
            answer3: 'A： 若商品有破損、品項錯誤或其他問題，請於 7 日內拍照並聯絡客服，我們將儘速協助處理。',
        });
    };
    
    cat = () => {
        this.setState({
            answer4: 'A： 根據《消費者保護法》，您享有商品到貨後七天鑑賞期，鑑賞期非試用期，退貨商品須為全新未拆封狀態。',
            answer5: '',
            answer6: '',
        });
    };
    
    dog = () => {
        this.setState({
            answer4: '',
            answer5: 'A： 若是個人因素退貨（如不喜歡、買錯），需自行負擔運費；若因瑕疵或出錯，則由我們全額負擔。',
            answer6: '',
        });
    };
    
    fish = () => {
        this.setState({
            answer4: '',
            answer5: '',
            answer6: 'A： 若商品與描述不符，請於七天內拍照並聯繫客服，我們將提供換貨或退款服務。',
        });
    };
    
    eleven = () => {
        this.setState({
            answer7: 'A： 小心詐騙！我們不會主動打電話要求您操作 ATM 或提供信用卡資訊。有任何疑問，請直接聯繫官方客服。',
            answer8: '',
            answer9: '',
        });
    };
    
    killer13 = () => {
        this.setState({
            answer7: '',
            answer8: 'A： 詐騙集團常利用假簡訊騙您點擊連結。請勿點擊不明網址，也勿回傳個資。',
            answer9: '',
        });
    };

    orange = () => {
        this.setState({
            answer7: '',
            answer8: '',
            answer9: 'A： 這可能是釣魚網站！請確認寄件者信箱是否為官方信箱，並從我們官網登入，勿從不明連結操作。',
        });
    };

    newapple = () => {
        this.setState({ showAppleBlock: true,
            showBananaBlock: false,
            showCatBlock: false, });
    }
    
    newbanana = () => {
        this.setState({ showAppleBlock: false,
            showBananaBlock: true,
            showCatBlock: false, });
    }

    newcat = () => {
        this.setState({ showAppleBlock: false,
            showBananaBlock: false,
            showCatBlock: true, });
    }



    render() {
        return (
            <div className={`container-lg ${style.bigerdiv}`}>
                <div className={style.nivdiv}>
                    <span className={style.nivspan} ref={this.g1} onClick={this.newapple}>購物須知</span>
                    <span className={style.nivspan} ref={this.g2} onClick={this.newbanana}>消費者權益</span>
                    <span className={style.nivspan} ref={this.g3} onClick={this.newcat}>防詐騙宣導</span>
                </div>
                <div ref={this.koufu}>
                    {this.state.showAppleBlock && (
                        <div>
                            <div onClick={this.apple}className={style.quest} >
                                {this.state.quest1}
                            </div>
                            <span className={style.answer}>{this.state.answer1}</span>
                            <div onClick={this.banana} className={style.quest}>{this.state.quest2}</div>
                            <span className={style.answer}>{this.state.answer2}</span>
                            <div onClick={this.pieapple} className={style.quest}>{this.state.quest3}</div>
                            <span className={style.answer}>{this.state.answer3}</span>

                        </div>
                    )}
                    {this.state.showBananaBlock && (
                        <div>
                            <div className={style.quest} onClick={this.cat}>{this.state.quest4}</div>
                            <span className={style.answer}>{this.state.answer4}</span>
                            <div className={style.quest} onClick={this.dog}>{this.state.quest5}</div>
                            <span className={style.answer}>{this.state.answer5}</span>
                            <div className={style.quest} onClick={this.fish}>{this.state.quest6}</div>
                            <span className={style.answer}>{this.state.answer6}</span>
                        </div>
                    )}
                    {this.state.showCatBlock &&(
                        <div>
                            <div className={style.quest} onClick={this.eleven}>{this.state.quest7}</div>
                            <span className={style.answer}>{this.state.answer7}</span>
                            <div className={style.quest} onClick={this.killer13}>{this.state.quest8}</div>
                            <span className={style.answer}>{this.state.answer8}</span>
                            <div className={style.quest} onClick={this.orange}>{this.state.quest9}</div>
                            <span className={style.answer}>{this.state.answer9}</span>

                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Needhelp;