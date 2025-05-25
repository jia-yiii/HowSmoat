import React, { Component } from 'react';
import styles from './PdAttr.module.css';
import PawDisplay from 'component/ProductDetailPage/PawDisplay';

class PdAttr extends Component {
    render() {
        const { pdAttr } = this.props
        return (<>
            {/* <h1>Attr說明頁</h1> */}
            <div className={`mx-2 paw-bg-lightenbrown ${styles.attrBg}`}>
                <table className={`p-2 ${styles.table}`}>
                    <thead>
                        <tr>
                            <th>類別</th>
                            <th>說明</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pdAttr.brand && (<tr>
                            <td>品牌</td>
                            <td>{pdAttr.brand}</td>
                        </tr>)}
                        {pdAttr.name &&(<tr>
                            <td>名稱</td>
                            <td>{pdAttr.name}</td>
                        </tr>)}
                        {pdAttr.buydate && (<tr>
                            <td>購入時間</td>
                            <td>{pdAttr.buydate}</td>
                        </tr>)}
                        {pdAttr.new_level && (
                            <tr>
                                <td>保存狀況</td>
                                <td><PawDisplay rating={pdAttr.new_level}/></td>
                            </tr>
                        )}

                        {pdAttr.model && (<tr>
                            <td>型號</td>
                            <td>{pdAttr.model}</td>
                        </tr>)}

                        {pdAttr.pattern && (<tr>
                            <td>樣式</td>
                            <td>{pdAttr.pattern}</td>
                        </tr>)}

                        {pdAttr.size && (<tr>
                            <td>尺寸</td>
                            <td>{pdAttr.size}</td>
                        </tr>)}

                        {pdAttr.color && (<tr>
                            <td>顏色</td>
                            <td>{pdAttr.color}</td>
                        </tr>)}
                        {pdAttr.weight && (<tr>
                            <td>重量</td>
                            <td>{pdAttr.weight}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>

        </>);
    }
}

export default PdAttr;