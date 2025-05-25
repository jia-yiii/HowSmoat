import React, { Component } from 'react';
import SellerProfile from './SellerProfile';
import SellerOtherPd from './SellerOtherPd';
import SReview from './SReview';

class SellerInfo extends Component {
    state = {  } 
    render() { 
        const {review, userProfile, avgRating, ratingCount,sellerOtherPd}=this.props
        return (<>
        {/* <h1>賣家合併頁</h1> */}
        <div className='my-3 py-3'>
        <SellerProfile 
            userProfile={userProfile}
            avgRating={avgRating}
            ratingCount={ratingCount}/>
        <SellerOtherPd sellerOtherPd={sellerOtherPd}/>
        <SReview review={review} />
        </div>
        </>);
    }
}
 
export default SellerInfo;