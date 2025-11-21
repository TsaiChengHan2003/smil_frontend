import AcroolCarousel, { AcroolSlideCard } from '@acrool/react-carousel';
import styles from '@styles/components/carousel.module.scss';
import { useState } from 'react';

export default function Carousel({ images = [] }) {
  const [nowImageIndex, setNowImageIndex] = useState(0);
  const slides = images?.map((row) => (
    <AcroolSlideCard key={row.photo_id} style={{ height: '100%', width: '100%', pointerEvents: 'none' }}>
      <img
        className={styles.slideImage}
        src={row.url}
        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        alt=""
      />
    </AcroolSlideCard>
  ));

  return (
    <div className={styles.carouselContainer}>
      <AcroolCarousel
        data={slides}
        height={{ widthRatio: 16, heightRatio: 9 }}
        isEnableAutoPlay
        autoPlayTime={3000}
        isEnableLoop
        isEnableNavButton
        isEnablePagination
        onSlideChange={(state) => {
          const next = state?.source?.activeIndex ?? 0;
          setNowImageIndex(next);
        }}
      />
      <div className={styles.centerContent}>
        <div className='d-flex flex-column'>
          <p className={styles.title}>Speech And Machine</p>
          <p className={styles.title}>Intelligence Lab</p>
        </div>
        <p className={styles.subtitle}>The Speech And Machine Intelligence Lab is a research group that focuses on the development of speech and machine intelligence technologies.</p>
        {images.length > 0 && images[nowImageIndex].link_url && <a href={images[nowImageIndex].link_url} className={styles.navigationButton}>{images[nowImageIndex].description }</a>}
      </div>
    </div>
  );
}