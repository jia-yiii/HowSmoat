import React, { Component } from 'react';
import axios from 'axios';
//top
import PdImageGallery from './top/PdImageGallery.jsx'
import PdTitleMessage from './top/PdTitleMessage.jsx';
import AddToCartBtn from '../share/AddToCartBtn.jsx';
import AddToMyFavorite from '../share/AddToMyFavorite.jsx';
import ShareProducts from './top/ShareProductsBtn.jsx';
import PdTitle from './top/PdTitle.jsx';
import PdQuantity from '../share/PdQuantity.jsx';
//bottom
import SwitchPage from './bottom/SwitchPage.jsx';
import PdInfo from './bottom/pdInfo/PdInfo.jsx';
import SellerInfo from './bottom/sellerInfo/SellerInfo.jsx';
import NReview from './bottom/pdInfo/NReview.jsx';
import NewSideBar from '../ProductPage/SideBar/SideBar.jsx';
import SeSideBar from '../SeProductPage/SideBar/SideBar.jsx';
import HotRanking from '../ProductPage/HotRanking/HotRanking.jsx';
import { CartContext } from 'component/Cart/CartContext.jsx';
import cookie from 'js-cookie';

class PdDetailPage extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      currentPage: "description",
      isFavorite: false,
      isShare: false,
      count: 1,
      product: null,
      sellerInfo: {},
      review: [],
      loading: true,
      error: null,
      uid: cookie.get('user_uid') || null
    }
  }

  render() {
    //目前商品

    const currentPd = this.state.product;
    if (this.state.loading) return <div>載入中...</div>;
    if (this.state.error || !currentPd) return <div>{this.state.error || "找不到商品"}</div>;
    //目前商品的賣家資訊
    // const userProfile = this.state.userinfo.find(user => user.uid === currentPd.uid);
    const userProfile = this.state.sellerInfo || {
      uid: currentPd.uid,
      username: '賣家',
      photo: ''
    };

    // 根據商品類型取得相應的評論
    const isNew = currentPd.condition === "new";
    const relevantReviews = isNew
      ? this.state.review.filter((review) => String(review.pid) === String(currentPd.pid))
      : this.state.review;

    // 評價總分與數量
    const ratingCount = relevantReviews.length;
    const totalRating = relevantReviews.reduce((sum, review) => sum + Number(review.rating), 0);
    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : "還沒有評價";

    return (
      <>
        <div className="container-fluid">
          <div className="row">
            {/* 左 */}
            <div className='col-md-2 d-none d-md-block'>
              {/* 導入動物+商品種類篩選 */}
              {currentPd.condition === "new" ? <NewSideBar /> : <SeSideBar />}

            </div>

            {/* 中 */}
            <div className={currentPd.condition === "new" ? "col-md-8" : "col-md-10"}>
              {/* 上半部 */}
              <div className='p-2 mb-4'>
                <div className='d-flex flex-column flex-md-row align-items-center'>
                  <div className='d-flex align-items-center col-md-6 mr-2'>
                    {/* 左邊圖片 */}
                    <PdImageGallery
                      images={currentPd.images}
                      condition={currentPd.condition} />
                  </div>
                  <div className='col-md-6 my-4 ml-3'>
                    {/* 右邊說明 */}
                    <div>
                      <div className=''>
                        <PdTitle
                          pdname={currentPd.pd_name} />
                      </div>
                      <PdTitleMessage
                        condition={currentPd.condition}
                        pid={currentPd.pid}
                        categories={currentPd.categories}
                        price={currentPd.price}
                        stock={currentPd.stock}
                        brand={currentPd.attribute.brand}
                        city={currentPd.city}
                        district={currentPd.district}
                        newLevel={currentPd.new_level}
                        avgRating={avgRating}
                        ratingCount={ratingCount}
                      />
                    </div>
                    {/* 數量調整 */}
                    <div className='d-flex align-items-center flex-md-row flex-wrap'>
                      <PdQuantity
                        quantity={this.state.count}
                        max={parseInt(currentPd.stock)}
                        onQuantityChange={(newQty) => this.setState({ count: newQty })} />
                      
                    </div>
                    {/* 加入購物車、收藏、分享 */}
                      <div className='d-flex align-items-center'>
                        <AddToCartBtn aria-label="加入購物車" type="text" product={currentPd} quantity={this.state.count} />
                        <AddToMyFavorite
                          onClick={this.favBtnClick}
                          isFavorite={this.state.isFavorite}
                          size="24px"
                          type="icon" />
                        <ShareProducts
                          onClick={this.shareOthers}
                          isShare={this.state.isShare} />
                      </div>
                  </div>
                </div>
              </div>
              {/* 下半部 */}
              <div>
                <SwitchPage
                  currentPage={this.state.currentPage}
                  changePage={(click) => { this.setState({ currentPage: click }) }}
                  condition={currentPd.condition} />

                {this.state.currentPage === "description" ?
                  <PdInfo
                    condition={currentPd.condition}
                    description={currentPd.description}
                    images={currentPd.images}
                    pdAttr={currentPd.attribute} /> : (currentPd.condition === "new" ?
                      <NReview
                        review={this.state.review} />
                      :
                      <SellerInfo
                        userProfile={userProfile}
                        review={this.state.review}
                        avgRating={avgRating}
                        ratingCount={ratingCount}
                        sellerOtherPd={this.state.sellerOtherPd} />)}
              </div>
            </div>

            {/* 右，商品是新品時顯示熱門排行 */}
            {currentPd.condition === "new" ? <><div className='col-md-2 d-none d-md-block'><HotRanking /></div></> : ""}

          </div>

        </div>
      </>
    );
  }
  // componentDidUpdate() {
  //   console.log(this.state.uid, this.props.pid);

  // }
  componentDidMount() {
    const { pid } = this.props;
    const { setSellers } = this.context;
    let { uid } = this.state
    //柯加的
    if (uid) {

      axios.get(`http://localhost:8000/select/collect/${uid}/${pid}`)
        .then(res => {
          console.log(res.data);
          this.setState({
            uid: cookie.get('user_uid'),
            pid: pid,
            isFavorite: res.data
          })
        })
    }

    //柯加的
    this.setState({ loading: true });

    axios.get(`http://localhost:8000/productslist/${pid}`)
      .then(res => {
        const product = res.data;
        this.setState({ product });

        if (product.condition === "new") {
          return axios.get(`http://localhost:8000/review/newproduct/${product.pid}`)
            .then(reviewRes => {
              this.setState({
                review: reviewRes.data,
                sellerOtherPd: [],
                loading: false
              });
            });
        }

        return axios.get(`http://localhost:8000/get/userinfo`)
          .then(userRes => {
            const sellerInfo = userRes.data.find(user => String(user.uid) === String(product.uid));

            if (sellerInfo) {
              setSellers([{ uid: sellerInfo.uid, username: sellerInfo.username || "未命名賣家" }]);
              this.setState({
                sellerInfo: {
                  ...sellerInfo,
                  photoUrl: `http://localhost:8000/userphoto/${sellerInfo.uid}`
                }
              });
            }

            return axios.get(`http://localhost:8000/sellerOtherPd/${product.uid}/${product.pid}`);
          })
          .then(otherPdRes => {
            this.setState({ sellerOtherPd: otherPdRes.data || [] });

            return axios.get(`http://localhost:8000/review/seller/${product.uid}`);
          })
          .then(reviewRes => {
            this.setState({
              review: reviewRes.data,
              loading: false
            });
          });
      })
      .catch(err => {
        console.error("載入資料失敗", err);
        this.setState({ error: "找不到商品或賣家", loading: false });
      });
  }

  // addToCart = async () => {
  //   const { addToCart } = this.context;
  //   const currentPd = this.state.product;
  //   const cartItem = {
  //     ...currentPd,
  //     quantity: this.state.count
  //   };

  //   const result = await addToCart(cartItem); // ⬅️ 等待結果
  //   if (result === 'new' || result === 'updated') {
  //     const go = window.confirm("已加入購物車！是否前往查看？");
  //     if (go) {
  //       window.location.href = '/ShoppingCartPage';
  //     }
  //   }
  // };

  favBtnClick = (e) => {
    if (this.state.uid) {
      if (this.state.isFavorite) {//如果按之前是被收藏
        //delete API
        axios.get(`http://localhost:8000/delete/collect/${this.state.uid}/${this.props.pid}`)
      }
      else {//如果按之前是沒有被收藏
        //edit API
        axios.get(`http://localhost:8000/insert/collect/${this.state.uid}/${this.props.pid}`)

      }
      this.setState((prevState) => ({
        isFavorite: !prevState.isFavorite,
      }));
    }
    else {
      alert('登入後才能收藏!!')
    }
  }
  shareOthers = async () => {
    try {
      // 複製網址
      await navigator.clipboard.writeText(window.location.href);
      this.setState({ isShare: true });

      setTimeout(() => {
        this.setState({ isShare: false });
      }, 1000);
    } catch (err) {
      console.error('複製失敗', err);
    }
  };
}

export default PdDetailPage;
