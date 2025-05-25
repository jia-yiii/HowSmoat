import React, { Component } from 'react';
import style from './SReview.module.css';
import StarDisplay from '../../StarDisplay';
import styles from './SReview.module.css'
class SReview extends Component {
  state = {
    commentState: false,
  }
  render() {
    const { commentState } = this.state
    const { review } = this.props
    return (
      <>
        {/* <h1>賣家評論</h1> */}
        {/* 按鈕-展開評論 */}
        <div className={`my-3 d-flex flex-fill justify-content-center ${commentState === true ? style.btnClicking : ""} ${styles.click}`}
          onClick={this.commentShow}>
          <div className='ptxtb3 ml-4'>對賣家的評論</div>
          <div >
            <i className={`bi ${commentState === true ? "bi-caret-up-fill" : "bi-caret-down-fill"} ml-2`}></i>
          </div>
        </div>
        {/* 評論區 */}
        <>
          {/* 評論區 */}
          {commentState && <div>
            {review.length > 0 ? review.map((item, index) => (
              <div className={styles.SReview}>
                <div className='d-flex justify-content-between'>
                  <div>
                    <span className='ptxtb4'>{item.username}</span>
                    <span className='mx-3'><StarDisplay rating={item.rating} /></span>
                  </div>
                  <div className='mb-2'>{formatDate(item.create_time)}</div>
                </div>
                <div>
                <div className='mb-2'>
                  {/* <span className={styles.text}>商品：</span> */}
                  <span className={styles.text}>{item.pd_name}</span>
                </div>
                  <span>評論：</span>
                  <span>{item.comment}</span>
                </div>
              </div>
            )) : <div className="p-4">尚無評論</div>}
          </div>}
        </>

      </>);
  }
  commentShow = () => {
    // alert("click")
    this.setState({ commentState: !this.state.commentState })
  }
}
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, '0');

  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};
export default SReview;