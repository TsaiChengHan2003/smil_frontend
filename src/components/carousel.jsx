import AcroolCarousel, { AcroolSlideCard } from '@acrool/react-carousel';
import styles from '@styles/components/carousel.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Carousel({ images = [] }) {
  const [nowImageIndex, setNowImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  // 根據螢幕寬度動態調整比例
  const [aspectRatio, setAspectRatio] = useState({ widthRatio: 21, heightRatio: 9 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMedium, setIsMedium] = useState(false);
  
  useEffect(() => {
    const updateRatio = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1400);
      setIsMedium(width >= 1400 && width < 1600);
      
      if (width < 768) {
        // 手機版：使用更窄的比例，讓高度更大
        setAspectRatio({ widthRatio: 3, heightRatio: 4 });
      } else if (width < 1400) {
        // 平板/中等螢幕：使用 16:9 比例，確保填滿
        setAspectRatio({ widthRatio: 16, heightRatio: 9 });
      } else if (width < 1600) {
        // 1400~1600px：使用 18:9 比例
        setAspectRatio({ widthRatio: 18, heightRatio: 9 });
      } else {
        setAspectRatio({ widthRatio: 21, heightRatio: 9 });
      }
    };
    
    updateRatio();
    window.addEventListener('resize', updateRatio);
    return () => window.removeEventListener('resize', updateRatio);
  }, []);

  const slides = images?.map((row, index) => (
    <AcroolSlideCard key={index} style={{ height: '100%', width: '100%', pointerEvents: 'none' }}>
      <img
        className={styles.slideImage}
        src={row.url}
        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        alt={row.title || ''}
      />
    </AcroolSlideCard>
  ));

  const currentImage = images[nowImageIndex] || {};

  const handleSlideChange = (state) => {
    setIsVisible(false);
    setTimeout(() => {
      const next = state?.source?.activeIndex ?? 0;
      setNowImageIndex(next);
      setIsVisible(true);
    }, 300);
  };

  return (
    <div className={styles.carouselContainer}>
      <AcroolCarousel
        data={slides}
        height={isMobile || isTablet || isMedium ? "100%" : aspectRatio}
        style={(isMobile || isTablet || isMedium) ? { height: '100%', width: '100%' } : undefined}
        isEnableAutoPlay
        autoPlayTime={3000}
        isEnableLoop
        isEnableNavButton
        isEnablePagination
        onSlideChange={handleSlideChange}
      />
      <div className={`${styles.centerContent} ${isVisible ? styles.fadeIn : styles.fadeOut}`}>
        <div className={styles.textWrapper}>
          {currentImage.title ? (
            <h1 className={styles.title} key={currentImage.title}>
              {currentImage.title}
            </h1>
          ) : (
            <>
              <h1 className={styles.title}>Speech And Machine</h1>
              <h1 className={styles.title}>Intelligence Lab</h1>
            </>
          )}
        </div>
        {currentImage.text && (
          <p className={styles.subtitle} key={currentImage.text}>
            {currentImage.text}
          </p>
        )}
        {currentImage.link_url && (
          <a 
            className={styles.navigationButton}
            key={currentImage.link_url}
            onClick={() => navigate(currentImage.link_url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{currentImage.description || '了解更多'}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}