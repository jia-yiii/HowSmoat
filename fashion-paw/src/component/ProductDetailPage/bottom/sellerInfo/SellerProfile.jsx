import React, { Component } from 'react';
import PawDisplay from 'component/ProductDetailPage/PawDisplay';
import styles from './SellerProfile.module.css'

class SellerProfile extends Component {

    render() {
        const { userProfile, avgRating, ratingCount } = this.props
        // console.log(avgRating)
        // console.log(ratingCount)
        return (<>

            {/* 賣家基本資料 */}

            <div className="container mx-1 ">
                <div className={styles.wrapper}>
                    {/* 左邊：大頭貼＋總評價聯絡我，並排 */}
                    <div className="">
                        {/* 大頭貼 */}
                        <div className="mb-3">
                            <img
                                className="rounded img-fluid"
                                src={userProfile.photoUrl}
                                alt="大頭貼"
                                style={{
                                    maxWidth: '150px', // 最大寬度限制
                                    width: '100%',
                                    height: 'auto', // 保持比例
                                    objectFit: 'cover',
                                    objectPosition: 'center center',
                                }}
                            />
                        </div>

                        {/* 總評價＋聯絡我（橫排） */}
                        <div className="d-flex justify-content-center align-items-center  w-100">
                            <div className="text-center rounded  px-2">

                                {avgRating === "還沒有評價" ? "還沒有評價" : <><div className=' mx-1'><PawDisplay rating={Math.floor(avgRating)} /></div>
                                    <span className="ptxt5">
                                        （<span title="平均分數">{avgRating} </span>｜<span title='評論數'>{ratingCount}</span>）
                                    </span></>}
                            </div>

                        </div>
                    </div>

                    {/* 下方：關於賣家 */}
                    <div className={`py-3 pl-4 ${styles.aboutseller}`} >
                        <div className={styles.about}>
                            <p className='ptxtb4'>關於{userProfile.username}
                            </p>
                            <p>
                                <span className='ptxt5'>上次登錄時間：</span> <span className='ptxt5'>{formatDate(userProfile.last_time_login)}</span>
                            </p>
                            <div className={styles.contactbtn} onClick={this.contact}>
                                聯絡我
                            </div>
                        </div>
                        <p>
                            {userProfile.aboutme}
                        </p>
                    </div>
                </div>
            </div>

        </>);
    }
    contact = () => {
        alert("click")
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
export default SellerProfile;