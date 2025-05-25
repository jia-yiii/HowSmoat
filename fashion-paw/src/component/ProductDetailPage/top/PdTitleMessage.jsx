import React, { Component } from 'react';
import PawDisplay from '../PawDisplay';
import StarDisplay from '../StarDisplay';
import styles from './PdTitleMessage.module.css'
class PdTitleMessage extends Component {
    state = {}
    render() {
        const { condition, pid, price, stock, brand, city, district, newLevel, avgRating, ratingCount } = this.props

        return (<>
            {/* <h1>商品重點區</h1> */}
            <div>
                <div className='d-flex my-2'>
                    <div> 商品編號：</div><div>{pid}</div>
                </div>
                {/* 二手出現座標｜新品出現品牌 */}
                {condition === "second" ? <>
                    <div className='d-flex my-2'>
                        <div> 商品座標：</div><div>{city}{district}</div>
                    </div>
                </> : <>
                    <div className='d-flex my-2'>
                        <div> 商品品牌：</div><div>{brand}</div>
                    </div>
                </>}
                {/* 二手出現保存狀況｜新品出現商品評價 */}
                {condition === "second" ? <>
                    <div className='d-flex my-2'>
                        <div> 保存狀況：</div>
                        <div><PawDisplay rating={newLevel} /></div>
                    </div>
                </> : <>
                    <div className='d-flex my-2 '>
                        <span> 商品評價：</span>
                        <StarDisplay rating={Math.floor(avgRating)} />
                        <div className="ptxt5 d-flex align-items-end">（<span title="平均分數">{avgRating} </span>｜<span title='評論數'>{ratingCount}</span>）</div>
                    </div>
                </>}

                <div className='d-flex my-2'>
                    <div> 配送方式：</div>
                    <div>{condition === "second" ? "宅配 / 超商取貨 / 面交" : "宅配 / 超商取貨"}</div>
                </div>

                <div className={`d-flex align-items-center mt-3 `}>
                    {/* <div className='ptxt2'>NT$</div> */}
                    <div className={`ptxtb2 ${styles.price}`}>NT$ {price}</div>
                    <div className='ml-4'>
                        <span>還剩</span>
                        <span className='mx-2 ptxtb4 paw-text-pink'>{stock}</span>
                        <span>件</span>
                    </div>
                </div>
            </div>


        </>);
    }
}

export default PdTitleMessage;