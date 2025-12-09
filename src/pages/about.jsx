import Fragment from "@/components/common/Fragment";
import { useTranslation } from 'react-i18next'
import styles from '@/assets/styles/components/about.module.scss'

export default function About() {
  const { t } = useTranslation()
  const about = t('about', { returnObjects: true })

  return (
    <Fragment>
      <div className={styles.container}>
        {/* 教授介紹*/}
        <section className={styles.introSection}>
          <div className={styles.introText}>
            <h2 className={styles.title}>{about.introTitle}</h2>
            <p>{about.introContent}</p>
          </div>
          <div className={styles.introMedia}>
            {/* 預留形象照 / 實驗室照片 */}
            <div className={styles.imageFrame}>
              {/* 之後你可以把這個 div 換成 <img src="..." /> */}
              <span className={styles.imagePlaceholderText}>SMIL Lab / Hero Image</span>
            </div>
          </div>
        </section>

        {/* 實驗室歷史 */}
        <section>
          <h2 className={styles.subtitle}>{about.historyTitle}</h2>
          <p>{about.historyContent}</p>
        </section>

        {/* 老師的期許 */}
        <section>
          <h2 className={styles.subtitle}>{about.expectTitle}</h2>
          <p>{about.expectContent}</p>
          <ul className={styles.expectContent}>
            <li>{about.expectContent1}</li>
            <li>{about.expectContent2}</li>
            <li>{about.expectContent3}</li>
            <li>{about.expectContent4}</li>
          </ul>
        </section>

        {/* 加入我們 */}
        <section>
          <div className="d-flex gap-2">
            <div className={styles.joinus}>
              <h2 className={styles.subtitle}>{about.joinTitle}</h2>
              <textarea>{about.joinContent}</textarea>
              
              <div className={styles.addressSection}>
                <h3>{t('about.labInfoTitle')}</h3>
                <h3>{t('about.phone')}： {t('footer.phone')}</h3>
                <h3>{t('about.fax')}： {t('footer.fax')}</h3>
                <h3>{t('about.email')}：berlin@csie.ntnu.edu.tw</h3>
                <h3>{t('about.meetingFraquencyTitle')}：{t('about.meetingFraquency')}</h3>
                <h3>{t('about.address')}： {t('footer.address')}</h3>
              </div>
            </div>

            <div className={styles.mapWrapper}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d717.4633027364389!2d121.53531769504761!3d25.007304387367107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a9602b8f4639%3A0x32245faca67b22c9!2z5ZyL56uL6Ie654Gj5bir56-E5aSn5a246LOH6KiK5bel56iL5a2457O75pqo56CU56m25omA!5e0!3m2!1szh-TW!2sus!4v1764603215420!5m2!1szh-TW!2sus" 
                width="900" 
                height="450" 
                className={styles.mapFrame} 
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                alt="SMIL Lab Location"
              />
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  )
}