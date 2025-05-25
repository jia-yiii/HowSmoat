// Homepage.jsx
import React, { useState, useEffect } from 'react';
import NewsBar from './NewsBar';
import Banner from './Banner';
import SectionLinks from './SectionLinks.jsx';
import CategoryIcons from './CategoryIcons';
import BestsellerTabs from './BestsellerTabs';
import NewsEventsSection from './NewsEventsSection';
import InfoSection from './InfoSection';
// import styles from './Homepage.module.css'

function Homepage() {

  return (
    <div>
      <Banner />
      <NewsBar />
      <SectionLinks />
      <BestsellerTabs />
      <NewsEventsSection />
      <InfoSection />
    </div>
  );
}

export default Homepage;
