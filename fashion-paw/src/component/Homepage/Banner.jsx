import React, { useState, useEffect } from 'react';
import styles from './Banner.module.css';
import Dog9 from './images/Dog9.jpg';
import Dog15 from './images/Dog15.jpg';
import Cat8 from './images/Cat8.jpg';
import Cat9 from './images/Cat9.jpg';
import Cat10 from './images/Cat10.jpg';
import Hamster2 from './images/Hamster2.jpg';
import Bird3 from './images/Bird3.jpg';


const banners = [
  {
    src: Dog9,
    title: '與　毛　相　遇　|　拾　獲　美　好',
    desc: 'Good to meet HowSmoat, pick up the beauty.'
  },
  {
    src: Cat8,
    title: '療　癒　相　伴　|　每　日　都　是　毛　孩　節',
    desc: 'Every day is a gift from pets.'
  },
  {
    src: Hamster2,
    title: '拾　起　幸　福　|　從　一　份　陪　伴　開　始',
    desc: 'Pick up happiness, starting with companionship.'
  },
  {
    src: Bird3,
    title: '用　心　挑　選　|　為　牠　也　為　這　世　界',
    desc: 'Mindful choices—for your pet and the planet.'
  },
  {
    src: Cat9,
    title: '和　貓　咪　一　起　|　把　生　活　變　得　柔　軟',
    desc: 'With a cat, life softens naturally.'
  },
  {
    src: Dog15,
    title: '用　回　收　的　心　意　|　愛　出　全　新　的　可　能',
    desc: 'Reused with love, renewed with care.'
  },
  {
    src: Cat10,
    title: '一　聲　呼　嚕　|　是　牠　對　你　的　深　情　告　白',
    desc: 'A purr is a love letter in disguise.'
  }
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % banners.length);
  };

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.bannerOverlay}></div> {/* ← 插在最上層 */}
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === current ? styles.active : ''}`}
        >
          <img src={banner.src} alt={`banner-${index}`} className={styles.bannerImage} />
          <div className={styles.bannerContent}>
            <h2>{banner.title}</h2>
            <p>{banner.desc}</p>
          </div>
        </div>
      ))}

      {/* 左右箭頭 */}
      <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>
        ❮
      </button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={nextSlide}>
        ❯
      </button>

      {/* 控制點 */}
      <div className={styles.dots}>
        {banners.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === current ? styles.activeDot : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
