// src/component/Homepage/SectionLinks.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SectionLinks.module.css';

import newImg from './images/newpd2.png';
import usedImg from './images/seconddogg.jpg';

const sections = [
  { key: 'new', label: '新品百貨', to: '/ProductPage', src: newImg },
  { key: 'used', label: '二手市場', to: '/SeProductPage', src: usedImg },
];

export default function SectionLinks() {
  return (
    <div className="container-lg mt-5 d-flex justify-content-center">
      <div className="row gx-5" style={{ width: 1000 }}>
        {sections.map(sec => (
          <div key={sec.key} className="col-6 col-md-6 ">
            <Link to={sec.to} className={styles.link}>
              <div className={styles.card}>
                <img
                  src={sec.src}
                  alt={sec.label}
                  className={`${styles.sectionImage} img-fluid`}
                />
                <div className={styles.caption}>
                  {sec.label}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
