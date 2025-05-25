// src/component/PetKnowledge/NewsEventsSection.jsx
import React, { useState, useEffect } from 'react';
import styles from './NewsEventsSection.module.css';
import pawicon from './images/pawicon.svg'
import newsimg from './images/test111.png'
import newsimg2 from './images/test33.png'
import newsimg3 from './images/test4.png'
import newsimg4 from './images/test2.png'
import newsimg5 from './images/test5.png'

const mockEvents = [
  { id: 1, title: '結帳金額滿399免運費', date: '2025/5/26-5/31', img: newsimg },
  { id: 2, title: '貓抓板買二送一', date: '2025/6/10-6/15', img: newsimg2 },
  { id: 3, title: '全館玩具8折', date: '2025/7/1-7/5', img: newsimg3 },
  { id: 4, title: '新會員註冊送100元折價券', date: '2025/5/1-12/31', img: newsimg4 },
  { id: 5, title: '保健食品買三送一', date: '2025/5/22-5/30', img: newsimg5 }
];


export default function NewsEventsSection() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  return (
    <section className="container-lg" id='newsEvents'>
      <div className={styles.headerWrapper}>
        <h2 className={styles.title}>
          活動快報 <img src={pawicon} className={styles.icon} />
        </h2>
      </div>
      <div className="row">
        {events.map(e => (
          <div key={e.id} className="col-6 col-md-4 mb-4">
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={e.img} alt={e.title} className={styles.image} />
                <div className={styles.overlay}>
                  <h4>{e.title}</h4>
                  <p>{e.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
