// HelpMe.jsx
import React, { Component } from 'react';
import style from './aboutus.module.css';
import birdwatchyou from './image/birdwatchyou.png';
import dogcatcar from './image/dogcatcar.png';
import kusa from './image/kusa.png';
import cutebird from './image/cutebird.png';
import doginkusa from './image/doginkusa.png';
import catinkusasa from './image/catinkusasa.png';
//  外部CSS檔

class HelpMe extends Component {
    constructor(props) {
        super(props);
        this.movepanRef = React.createRef();
        this.oneboxRef = React.createRef();
        this.twoboxRef = React.createRef();
        this.threeboxRef = React.createRef();
        this.fourboxRef = React.createRef();
        this.kusa1Ref = React.createRef();
        this.kusa2Ref = React.createRef();
        this.kusa3Ref = React.createRef();
        this.kusa4Ref = React.createRef();
        this.state = {
            articles: [
                {
                    id: "123",
                    title: "為寵物打造更綠意的未來",
                    title: "為寵物打造更綠意的未來",
                    content: `
            歡迎來到好拾毛，一個專為愛寵打造的交易平台，這裡不僅提供全新的寵物商品，
            還有專為環保設計的二手交易區，讓你在關愛寵物的同時，也能為地球盡一份心力。
            
            無論是日常用品、玩具、床墊還是各式寵物配件，好拾毛都提供了豐富的選擇，滿足每位主人和寵物的需求。

我們致力於提供一個既安全又友善的購物環境，不僅支持全新商品的購買，還能讓用戶方便地交換或購買二手寵物用品。
這樣的設計不僅能讓您的愛寵享有高品質的產品，還能幫助減少浪費，為環保貢獻力量。
所有交易都經過嚴格的審查和質量檢測，確保二手商品的安全與可靠。

在好拾毛，您不僅能夠購物，還能與其他寵物愛好者互動，分享經驗，並參與一場愛護動物與環境的行動。
我們相信，每一個小小的選擇，都是為了給未來的世界帶來更多綠意。

加入好拾毛，讓我們一起創造一個更好的寵物生活，同時保護我們的地球家園！
            歡迎來到好拾毛，一個專為愛寵打造的交易平台，這裡不僅提供全新的寵物商品，
            還有專為環保設計的二手交易區，讓你在關愛寵物的同時，也能為地球盡一份心力。
            
            無論是日常用品、玩具、床墊還是各式寵物配件，好拾毛都提供了豐富的選擇，滿足每位主人和寵物的需求。

我們致力於提供一個既安全又友善的購物環境，不僅支持全新商品的購買，還能讓用戶方便地交換或購買二手寵物用品。
這樣的設計不僅能讓您的愛寵享有高品質的產品，還能幫助減少浪費，為環保貢獻力量。
所有交易都經過嚴格的審查和質量檢測，確保二手商品的安全與可靠。

在好拾毛，您不僅能夠購物，還能與其他寵物愛好者互動，分享經驗，並參與一場愛護動物與環境的行動。
我們相信，每一個小小的選擇，都是為了給未來的世界帶來更多綠意。

加入好拾毛，讓我們一起創造一個更好的寵物生活，同時保護我們的地球家園！
          `
                },
                {
                    id: "456",
                    title: "核心理念",
                    title: "核心理念",
                    content: `
            在好拾毛，我們深信每一個寵物都是家庭的一份子，而我們的使命是為這些可愛的生命提供更好的生活品質。
            透過提供全新與二手寵物用品的交易平台，我們希望能夠打造一個更加環保與可持續的消費模式，減少資源浪費，並促進社會大眾對於環保與動物福利的關注。

環保與可持續性是我們的核心價值。
每一次的二手商品交易，都是一次對環境負責的選擇。
我們希望透過這樣的方式，讓更多人了解並參與到循環經濟中，實現消費與保護地球的雙重目標。
無論您是選擇全新商品還是二手用品，您都能夠在好拾毛找到滿意的選擇，同時為環境出一份微薄的力量。

以愛為核心，關懷每一個毛孩。我們不僅專注於產品的品質，更加重視每一位顧客與寵物之間的連結。
我們希望透過平台，讓每位寵物主人能夠輕鬆地為他們的愛寵挑選到最適合的用品，並建立一個愛與關懷的社群。

在好拾毛，我們相信每個小小的選擇，都能對未來產生深遠的影響。
讓我們一同努力，創造一個更綠意、更和諧的世界，為毛孩們和地球的明天添一份溫暖與希望。
            在好拾毛，我們深信每一個寵物都是家庭的一份子，而我們的使命是為這些可愛的生命提供更好的生活品質。
            透過提供全新與二手寵物用品的交易平台，我們希望能夠打造一個更加環保與可持續的消費模式，減少資源浪費，並促進社會大眾對於環保與動物福利的關注。

環保與可持續性是我們的核心價值。
每一次的二手商品交易，都是一次對環境負責的選擇。
我們希望透過這樣的方式，讓更多人了解並參與到循環經濟中，實現消費與保護地球的雙重目標。
無論您是選擇全新商品還是二手用品，您都能夠在好拾毛找到滿意的選擇，同時為環境出一份微薄的力量。

以愛為核心，關懷每一個毛孩。我們不僅專注於產品的品質，更加重視每一位顧客與寵物之間的連結。
我們希望透過平台，讓每位寵物主人能夠輕鬆地為他們的愛寵挑選到最適合的用品，並建立一個愛與關懷的社群。

在好拾毛，我們相信每個小小的選擇，都能對未來產生深遠的影響。
讓我們一同努力，創造一個更綠意、更和諧的世界，為毛孩們和地球的明天添一份溫暖與希望。
          `
                },
                {
                    id: "789",
                    title: "承諾願景",
                    title: "承諾願景",
                    content: `
            在好拾毛，我們的願景是成為全台灣最受信賴、最具影響力的寵物用品平台，並引領一場環保、可持續發展的寵物用品購物革命。
            我們承諾，以最高的誠信與責任心，為每一位寵物與主人提供最優質的服務和產品，並致力於推動環保理念，讓每個選擇不僅是對寵物的愛，更是對地球的守護。

我們的願景具體承諾如下：

提供最優質的產品：不論是全新商品還是二手物品，我們都確保每一個產品都經過嚴格的品質檢查，確保您的寵物使用安全無虞，享有舒適的生活。

推動環保與可持續性：我們致力於提供一個綠色、循環經濟的平台，讓更多的二手商品能夠重新找到新的生命，減少資源浪費。
我們堅信，從每一件小事做起，能共同為地球帶來正向改變。

打造愛與關懷的社群：我們不僅關心產品的銷售，更關心每一位顧客與毛孩之間的深厚情感。
我們鼓勵用戶分享他們的愛寵故事，並建立一個互助與支持的社群，讓每一個毛孩都能過上幸福、健康的生活。

不斷創新與成長：我們承諾將持續創新，優化平台體驗，滿足不斷變化的市場需求，
並且積極拓展更多環保、可持續的產品，讓顧客在購物的同時，能夠對未來充滿希望。

建立無憂的購物體驗：我們為每一位用戶提供便捷、安全的購物體驗，無論是選購全新商品，
還是參與二手交易，我們的客戶服務團隊將始終如一地提供專業與友善的幫助，確保每一次交易都順利進行。

在好拾毛，我們的承諾是永遠以愛與責任為基礎，為毛孩們的未來，為每一位顧客的滿意，
為地球的明天，持續不懈地努力。
            在好拾毛，我們的願景是成為全台灣最受信賴、最具影響力的寵物用品平台，並引領一場環保、可持續發展的寵物用品購物革命。
            我們承諾，以最高的誠信與責任心，為每一位寵物與主人提供最優質的服務和產品，並致力於推動環保理念，讓每個選擇不僅是對寵物的愛，更是對地球的守護。

我們的願景具體承諾如下：

提供最優質的產品：不論是全新商品還是二手物品，我們都確保每一個產品都經過嚴格的品質檢查，確保您的寵物使用安全無虞，享有舒適的生活。

推動環保與可持續性：我們致力於提供一個綠色、循環經濟的平台，讓更多的二手商品能夠重新找到新的生命，減少資源浪費。
我們堅信，從每一件小事做起，能共同為地球帶來正向改變。

打造愛與關懷的社群：我們不僅關心產品的銷售，更關心每一位顧客與毛孩之間的深厚情感。
我們鼓勵用戶分享他們的愛寵故事，並建立一個互助與支持的社群，讓每一個毛孩都能過上幸福、健康的生活。

不斷創新與成長：我們承諾將持續創新，優化平台體驗，滿足不斷變化的市場需求，
並且積極拓展更多環保、可持續的產品，讓顧客在購物的同時，能夠對未來充滿希望。

建立無憂的購物體驗：我們為每一位用戶提供便捷、安全的購物體驗，無論是選購全新商品，
還是參與二手交易，我們的客戶服務團隊將始終如一地提供專業與友善的幫助，確保每一次交易都順利進行。

在好拾毛，我們的承諾是永遠以愛與責任為基礎，為毛孩們的未來，為每一位顧客的滿意，
為地球的明天，持續不懈地努力。
          `
                },
                {
                    id: "101",
                    title: "企業社會責任",
                    title: "企業社會責任",
                    content: `
            作為一家以環保與動物福利為核心的企業，好拾毛深知我們的使命不僅是提供高品質的寵物用品，還有責任回饋社會。
            除了致力於減少對環境的影響外，我們還積極參與動物保護活動，支持動物收容所，並且定期捐贈部分營收給需要幫助的毛孩，協助牠們找到愛心家庭。

我們相信，企業的成功不僅來自經濟的增長，更來自對社會與環境的貢獻。
因此，好拾毛會繼續不斷努力，在支持可持續發展和動物福利方面發揮更大作用，並讓每一位顧客都能感受到我們的誠意與責任。
            作為一家以環保與動物福利為核心的企業，好拾毛深知我們的使命不僅是提供高品質的寵物用品，還有責任回饋社會。
            除了致力於減少對環境的影響外，我們還積極參與動物保護活動，支持動物收容所，並且定期捐贈部分營收給需要幫助的毛孩，協助牠們找到愛心家庭。

我們相信，企業的成功不僅來自經濟的增長，更來自對社會與環境的貢獻。
因此，好拾毛會繼續不斷努力，在支持可持續發展和動物福利方面發揮更大作用，並讓每一位顧客都能感受到我們的誠意與責任。
          `
                }
            ]
        }
    }

    componentDidMount() {
        setTimeout(() => {
            // 使用 setTimeout 保證 DOM 元素完全渲染後再檢查滾動條
            this.scrollInterval = setInterval(() => {
                if (window.scrollY >= 200) {
                    if (this.movepanRef.current) {
                        this.movepanRef.current.classList.add(style["moveing"]);
                        this.startIntervals();
                    }
                }
            }, 200); // 每0.2秒檢查一次滾動條
        }, 0); // 讓它在下一個事件循環執行
    }

    componentWillUnmount() {
        this.clearIntervals();
    }

    startIntervals = () => {
        this.intervalId = setInterval(() => {
            const movepan = this.movepanRef.current;
            const onebox = this.oneboxRef.current;
            const kusa1 = this.kusa1Ref.current;
            if (movepan && onebox && kusa1 && movepan.offsetLeft > onebox.offsetLeft) {
                if (onebox.style.visibility !== "visible") {
                    onebox.style.visibility = "visible";
                    onebox.classList.add(style["dancebox"]);
                    kusa1.classList.add(style["bush-disappear"]);
                } else {
                    clearInterval(this.intervalId);
                }
            }
        }, 200);

        this.intervalId2 = setInterval(() => {
            const movepan = this.movepanRef.current;
            const twobox = this.twoboxRef.current;
            const kusa2 = this.kusa2Ref.current;
            if (movepan && twobox && kusa2 && movepan.offsetLeft > twobox.offsetLeft) {
                if (twobox.style.visibility !== "visible") {
                    twobox.style.visibility = "visible";
                    twobox.classList.add(style["dancebox"]);
                    kusa2.classList.add(style["bush-disappear"]);
                } else {
                    clearInterval(this.intervalId2);
                }
            }
        }, 200);

        this.intervalId3 = setInterval(() => {
            const movepan = this.movepanRef.current;
            const threebox = this.threeboxRef.current;
            const kusa3 = this.kusa3Ref.current;
            if (movepan && threebox && kusa3 && movepan.offsetLeft > threebox.offsetLeft) {
                if (threebox.style.visibility !== "visible") {
                    threebox.style.visibility = "visible";
                    threebox.classList.add(style["dancebox"]);
                    kusa3.classList.add(style["dogruning"]);
                } else {
                    clearInterval(this.intervalId3);
                }
            }
        }, 200);

        this.intervalId4 = setInterval(() => {
            const movepan = this.movepanRef.current;
            const fourbox = this.fourboxRef.current;
            const kusa4 = this.kusa4Ref.current;
            if (movepan && fourbox && kusa4 && movepan.offsetLeft > fourbox.offsetLeft) {
                if (fourbox.style.visibility !== "visible") {
                    fourbox.style.visibility = "visible";
                    fourbox.classList.add(style["dancebox"]);
                    kusa4.classList.add(style["fade-up"]);
                } else {
                    clearInterval(this.intervalId4);
                }
            }
        }, 200);
    };

    clearIntervals = () => {
        clearInterval(this.intervalId);
        clearInterval(this.intervalId2);
        clearInterval(this.intervalId3);
        clearInterval(this.intervalId4);
    };

    render() {
        return (
            <>
                {/* 背景圖 */}
                <img
                    src={birdwatchyou}
                    alt="background"
                    style={{ width: "100%", height: "800px", zIndex: "-1", position: "absolute", top: "calc(30%)" }}
                />

                {/* 車 */}
                <img
                    src={dogcatcar}
                    className={style.moveimg}
                    id="movepan"
                    ref={this.movepanRef}
                    style={{ width: "200px", height: "200px" }}
                    alt="movepan"
                />

                {/* 草叢 */}
                <img
                    src={kusa}
                    className={style.kusa}
                    id={style.kusa1}
                    ref={this.kusa1Ref}
                    style={{ visibility: "visible", border: "none" }}
                    alt="kusa1"
                />
                <img
                    src={cutebird}
                    className={style.kusa}
                    id={style.kusa2}
                    ref={this.kusa2Ref}
                    alt="kusa2"
                />
                <img
                    src={doginkusa}
                    className={style.kusa}
                    id={style.kusa3}
                    ref={this.kusa3Ref}
                    alt="kusa3"
                />
                <img
                    src={catinkusasa}
                    className={style.kusa}
                    id={style.kusa4}
                    ref={this.kusa4Ref}
                    alt="kusa4"
                />

                {/* 四個box */}
                <a href="#123" className={style.aboutusdera}>
                    <div className={style.first_box} id="onebox" ref={this.oneboxRef}>
                        <div className={style.boxContent}>
                            <h5>好拾毛</h5> <hr />
                            <span>為寵物打造</span><br />
                            <span>更綠意的未來</span>
                        </div>
                    </div>
                </a>

                <a href="#456" className={style.aboutusdera}>
                    <div className={style.two_box} id="twobox" ref={this.twoboxRef}>
                        <div className={style.boxContent}>
                            <h5>核心理念</h5> <hr />
                            <span>我們深信每一個寵物</span><br />
                            <span>都是家的一份子</span>
                        </div>
                    </div>
                </a>

                <a href="#789" className={style.aboutusdera}>
                    <div className={style.three_box} id="threebox" ref={this.threeboxRef}>
                        <div className={style.boxContent}>
                            <h5>承諾願景</h5> <hr />
                            <span>我們的願景</span><br />
                            <span>具體承諾如下</span>
                        </div>
                    </div>
                </a>

                <a href="#101" className={style.aboutusdera}>
                    <div className={style.four_box} id="fourbox" ref={this.fourboxRef}>
                        <div className={style.boxContent}>
                            <h5>企業社會責任</h5> <hr />
                            <div className={style.boxContentdetail}>
                                <span>好拾毛的使命是</span><br/>
                                <span>提供高品質的寵物用品</span>
                            </div>
                        </div>
                    </div>
                </a>


                {this.state.articles.map((article, index) => (
                    <div
                        key={article.id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: index === 0 ? "900px" : "0px"  // 第一篇文章才加 marginTop
                        }}
                        className='container-lg'
                    >
                        <div style={{ width: "100%", maxWidth: "800px", textAlign: "left", marginBottom: 50 }}>
                            <h4 id={article.id} style={{ textAlign: "center" }}>
                                {article.title}
                            </h4>
                            <p>
                                {article.content.split("\n").map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                            <hr />
                        </div>
                    </div>
                ))}
            </>
        );
    }
}

export default HelpMe;
