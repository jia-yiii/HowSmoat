import React, { Component } from 'react';
import styles from './PdImageGallery.module.css';

class PdImageGallery extends Component {
  constructor(props) {
    super(props);
    const images = props.images || [];
    const firstImage = images[0]?.img_path || '';
    this.state = {
      image: images,
      currentImage: firstImage,
      isZoomVisible: false,
      zoomPosition: { x: 0, y: 0 },
    };
    this.imageRef = React.createRef();
  }

  render() {
    const { image, currentImage, isZoomVisible, zoomPosition } = this.state;
    // const {condition} = this.props
    // console.log(currentImage)
    // const imagePath = condition ==="new" ? "/media/new_pd/" : "/media/second_pd/";
    return (
      <>
        {/* <h1>這是商品圖片窗</h1> */}
        <div className={styles.gallery}>
          {/* 大圖區 */}
          <div className={styles.main}>
            <div className="d-flex justify-content-center align-items-center">
              <i
                className="paw-btn-outline-pri-darkbrown bi bi-caret-left-fill ptxt2"
                onClick={this.leftArrowClick}
              ></i>
            </div>

            <div className={`m-1 ${styles.mainImageWrapper}`} >
              <img
                src={currentImage ? `${currentImage}` : "/media/default/no-image.png"}
                alt="商品瀏覽圖"
                className={styles.mainImage}
                ref={this.imageRef}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onMouseMove={this.handleMouseMove}
              />
              
              {isZoomVisible && (
                <div
                  className={styles.zoomBox}
                  style={{
                    top: `${zoomPosition.y}px`,
                    left: `${zoomPosition.x}px`,
                    backgroundImage:  `url(${currentImage})`,
                    backgroundPosition: `${-zoomPosition.x * 2 + 75}px ${-zoomPosition.y * 2 + 75}px`,
                  }}
                ></div>
              )}
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <i
                className="paw-btn-outline-pri-darkbrown bi bi-caret-right-fill ptxt2"
                onClick={this.rightArrowClick}
              ></i>
            </div>
          </div>

          {/* 小圖 */}
          <div className={styles.small}>
            {image.map((img, index) => (
              <div
                key={index}
                className={styles.smallGallery}
                onClick={() => this.handleImageClick(img.img_path)}
                style={{ cursor: 'pointer' }}
              >
                <img src={img.img_path ? `${img.img_path}` : "/media/default/no-image.png"} alt='商品圖
                '/>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  handleImageClick = (img) => {
    this.setState({ currentImage: img });
  };

  leftArrowClick = () => {
    const { image, currentImage } = this.state;
    const currentIndex = image.findIndex(img => img.img_path === currentImage);
    const preIndex = (currentIndex - 1 + image.length) % image.length;
    // console.log(preIndex)
    this.setState({ currentImage: image[preIndex].img_path });
  };

  rightArrowClick = () => {
    const { image, currentImage } = this.state;
    const currentIndex = image.findIndex(img => img.img_path === currentImage);
    const nextIndex = (currentIndex + 1 + image.length) % image.length;
    this.setState({ currentImage: image[nextIndex].img_path });
  };

  handleMouseEnter = () => {
    this.setState({ isZoomVisible: true });
  };

  handleMouseLeave = () => {
    this.setState({ isZoomVisible: false });
  };

  handleMouseMove = (e) => {
    const bounds = this.imageRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    this.setState({ zoomPosition: { x, y } });
  };
}

export default PdImageGallery;