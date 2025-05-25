import React, { Component } from 'react';
import styles from './SellerOtherPd.module.css'
import AddToMyFavorite from '../../../share/AddToMyFavorite';
import AddToCartBtn from '../../../share/AddToCartBtn';
class SellerOtherPd extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.state = {
      showArrows: false,
    };
  }
  render() {
    const { sellerOtherPd } = this.props
    const { showArrows } = this.state
    console.log("👀 傳入 SellerOtherPd 的資料：", sellerOtherPd);
    if (!sellerOtherPd || sellerOtherPd.length === 0) {
      return (
        <div className="paw-bg-pri-darkbrown py-1">
          <p className="px-3 py-2 ptxtb2">此賣家沒有其他商品</p>
        </div>
      );
    }
    return (<>
      {/* 商品區 */}
      <div className={styles.wrapper}>
        <p className="ptxtb3">賣家的其他商品</p>

        {/* 卡片區 */}
        <div className={`d-flex align-items-center ${styles.main}`}>

          {/* 左鍵 */}
          {showArrows && (
            <div className="d-flex justify-content-center align-items-center px-2">
              <i
                className="paw-btn-outline-middlegreen bi bi-caret-left-fill ptxt2"
                onClick={this.leftArrowClick}
                style={{ cursor: 'pointer', fontSize: '24px' }}
              ></i>
            </div>
          )}

          {/* 商品區 */}
          <div
            className="d-flex flex-grow-1 overflow-hidden"
            ref={this.scrollRef}
            style={{ scrollBehavior: 'smooth', flexWrap: 'nowrap' }}
          >
            {sellerOtherPd.map((pd) => (
              <div key={pd.pid} className="card rounded mx-1" style={{ maxWidth: '200px', minWidth: '150px' }}>
                <div className='d-flex flex-column justify-content-between' style={{ height: '100%' }}>
                  <div className={`${styles.card} px-3`}>
                    <a href={`/product/${pd.pid}`}>
                      <img
                        src={pd.img_path ? `${pd.img_path}` : "/media/default/no-image.png"}
                        className="card-img-top p-2"
                        alt="商品圖"
                      />
                    </a>
                    <a href={`/product/${pd.pid}`} className="ptxt4 d-block text-truncate">
                      {pd.pd_name}
                    </a>
                    <div className={`${styles.price} text-center`}>NT$ {pd.price}</div>
                  </div>

                  <div className="d-flex justify-content-center mb-2">
                    <AddToMyFavorite pid={pd.pid} />
                    <AddToCartBtn
                      aria-label="加入購物車"
                      product={{
                        ...pd,
                        image: pd.img_path,
                        cart_id: String(pd.pid) // ✅ 確保格式一致
                      }}
                      type="icon"
                      quantity={this.state.count}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 右鍵 */}
          {showArrows && (
            <div className="d-flex justify-content-center align-items-center px-2">
              <i
                className="paw-btn-outline-middlegreen bi bi-caret-right-fill ptxt2"
                onClick={this.rightArrowClick}
                style={{ cursor: 'pointer', fontSize: '24px' }}
              ></i>
            </div>
          )}
        </div>
      </div>
    </>);
  }
  //商品不用滑動時箭頭消失
  componentDidMount() {
    if (this.scrollRef.current) {
      this.updateScrollBtn();
      this.scrollRef.current.addEventListener('scroll', this.updateScrollBtn);
      window.addEventListener('resize', this.updateScrollBtn);
    }
  }

  componentWillUnmount() {
    if (this.scrollRef.current) {
      this.scrollRef.current.removeEventListener('scroll', this.updateScrollBtn);
      window.removeEventListener('resize', this.updateScrollBtn);
    }
  }

  updateScrollBtn = () => {
    const container = this.scrollRef.current;
    if (!container) return;
    const { scrollWidth, clientWidth } = container;
    this.setState({ showArrows: scrollWidth > clientWidth + 1 });
  };

  leftArrowClick = () => {
    this.scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  rightArrowClick = () => {
    this.scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  }
}

export default SellerOtherPd;