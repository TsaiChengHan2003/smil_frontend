import AcroolCarousel, { AcroolSlideCard} from '@acrool/react-carousel';
import styles from '@styles/components/carousel.module.scss';

export default function Carousel({ images = [] }) {
  const acroolSlideItemData = images?.map(row => {
      return (
        <AcroolSlideCard key={row.photo_id} style={{ height: '100%', width: '100%' }}>
          <img className={styles.slideImage} src={row.url} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        </AcroolSlideCard>
      );
  });

  return (
    <div className={styles.carouselContainer}>
      <AcroolCarousel
        data={acroolSlideItemData}
        height={{ widthRatio: 16, heightRatio: 9 }}
        isEnableNavButton
        isEnablePagination
      />
      <div className={styles.centerContent}>
        <div className='d-flex flex-column'>
          <p className={styles.title}>Speech And Machine</p>
          <p className={styles.title}>Intelligence Lab</p>
        </div>
          <p className={styles.subtitle}>The Speech And Machine Intelligence Lab is a research group that focuses on the development of speech and machine intelligence technologies.</p>
      </div>
    </div>
  );
}