import Fragment from "@/components/common/Fragment";
import { useTranslation } from 'react-i18next'
import styles from '@/assets/styles/components/about.module.scss'

export default function About() {
  const { t, i18n } = useTranslation()
  const about = t('about', { returnObjects: true })

  return (
    <Fragment>
      <div className={styles.contrainer}>
        {/* introduce，professor記得要放這邊 */}
        <section>
          <h1>{about.title}</h1>
          <p>{about.content}</p>
        </section>
        {/* if you want to join us */}
        <section>
          <h1>{about.title}</h1>
          <p>{about.content}</p>
        </section>
        {/* 老師的期許 */}
        <section>
          <h1>{about.title}</h1>
          <p>{about.content}</p>
        </section>
        {/* history */}
        <section>
          <h1>{about.title}</h1>
          <p>{about.content}</p>
        </section>
        {/* address */}
        <section>
          <h1>{about.title}</h1>
          <p>{about.content}</p>
        </section>
      </div>
    </Fragment>
  )
}