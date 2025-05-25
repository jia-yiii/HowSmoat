import React, { Component } from 'react';
class PdDescription extends Component {

    render() {
        const { condition, description, images } = this.props

        // const imagePath = condition ==="new" ? "/media/new_pd/" : "/media/second_pd/";
        return (<>
            {/* <h1>我是商品說明</h1> */}

            <div className="container-fluid py-3">
                <div>
                    <p className="ptxtb3">{condition === "new" ? "商品說明：":"割愛原因："}</p>
                    <p>{description}</p>
                </div>

                <div>
                    <p className="ptxtb3">{condition === "new" ? "相關圖片：":"詳細狀態："}</p>
                    <div className="row">
                        {images.map((img, index) => (
                            <div className="col-12 col-md-12 mb-2 text-center" key={index}>
                                
                                <img src={img.img_path ? `${img.img_path}` : "/media/default/no-image.png"} alt={`商品圖片 ${index + 1}`} className="img-fluid shadow-sm" />
                                <p className='mt-3'>{img.img_value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

 
        </>);
    }
}

export default PdDescription;