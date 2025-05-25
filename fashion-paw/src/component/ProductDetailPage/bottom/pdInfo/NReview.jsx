import React, { Component } from 'react';
import StarDisplay from '../../StarDisplay';
import styles from './NReview.module.css'


class NReview extends Component {

  render() {
    const { review } = this.props
    return (<>
      {/* 評論區 */}
      <div>
        {review.length > 0 ? review.map((item, index) => (
          <div key={index} className={`${styles.review} p-3 mt-3 mx-3`}>
           <div className='d-flex justify-content-between'>

           <div className='d-flex align-items-center'>
              <span className='ptxtb4'>{item.username}
              </span>
              <span className='ml-3'><StarDisplay rating={item.rating} />
              </span>
            </div>
            <div className='mb-1'>{formatDate(item.create_time)}
            </div>
           </div>
            <div>
              <div className='ptxt4 pb-1 mt-2'>評論：<span>{item.comment}</span></div>
              
            </div>
          </div>
        )) : <div className="p-4">尚無評論</div>}
      </div>
    </>);
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
export default NReview;