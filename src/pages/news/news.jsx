import React from "react";
import Fragment from "@/components/common/Fragment";
import Tags from "@/components/tags"; 
import { useTranslation } from "react-i18next";
import { Monitor, Edit, Calendar, MapPin, Plus, ExternalLink } from "react-feather";
import { Link } from "react-router-dom";
import styles from "@/assets/styles/components/news.module.scss";
import { newsData, mockConferences } from "@/datas/news";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";

export default function News() {
  const { t } = useTranslation();
  const { isLoggedIn } = useGoogleAuth();

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{t("news.title")}</h1>
        <p className={styles.pageDescription}>{t("news.description")}</p>

        {/* 1. 會議投稿公告 */}
        <section>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Calendar size={24} /> {t("news.sections.conference")}
            </div>
            {isLoggedIn && (
              <Link to="/news/conference/new" className={styles.addBtn}>
                <Plus size={16} /> 新增會議
              </Link>
            )}
          </div>
          
          <div className={styles.listContainer}>
            <div 
              className={`${styles.listHeader} ${styles.conf}`}
              style={isLoggedIn ? { gridTemplateColumns: "130px 1fr 1.5fr 160px 80px" } : {}}
            >
              <span>{t("news.table.deadline")}</span>
              <span>{t("news.table.conference")}</span>
              <span>{t("news.table.location")}</span>
              <span style={{textAlign: 'right'}}>{t("news.table.conf_date")}</span>
              {isLoggedIn && <span style={{textAlign: 'center'}}>{t("news.table.action")}</span>}
            </div>

            {mockConferences.map(conf => (
              <div key={conf.id} className={styles.confRow} style={isLoggedIn ? { gridTemplateColumns: "130px 1fr 1.5fr 160px 80px" } : {}}>
                <div className={styles.confDeadline}>
                  <span className={styles.mobileLabel}>{t("news.table.deadline")}:</span>
                  <span className={styles.deadlineDate}>{conf.deadline}</span>
                </div>

                <div className={styles.confTitle}>
                  {/* ★ 修改：直接連去官網 */}
                  <a href={conf.url} target="_blank" rel="noreferrer" className={styles.linkText} title="前往官網">
                    {conf.title} <ExternalLink size={12} style={{marginLeft: 4, opacity: 0.5}}/>
                  </a>
                </div>

                <div className={styles.confLocation}>
                  <MapPin size={16} />
                  {conf.location}
                </div>

                <div className={styles.confDate}>
                  <span className={styles.mobileLabel}>{t("news.table.conf_date")}:</span>
                  <Calendar size={16} />
                  {conf.date}
                </div>

                {/* 編輯按鈕：前往我們的編輯頁面 */}
                {isLoggedIn && (
                  <div className={styles.newsActions}>
                    <Link to={`/news/conference/${conf.id}?edit=true`} className={styles.iconBtn}>
                      <Edit size={18} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 2. 普通公告 (保持不變) */}
        <section>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Monitor size={24} /> {t("news.sections.general")}
            </div>
            {isLoggedIn && (
              <Link to="/news/new" className={styles.addBtn}>
                <Plus size={16} /> 新增公告
              </Link>
            )}
          </div>
          
          <div className={styles.listContainer}>
            <div 
              className={`${styles.listHeader} ${styles.news}`}
              style={isLoggedIn ? { gridTemplateColumns: "110px 160px 1fr 100px 80px" } : {}}
            >
              <span>{t("news.table.publish_date")}</span>
              <span style={{textAlign: 'center'}}>{t("news.table.category")}</span>
              <span>{t("news.table.subject")}</span>
              <span style={{textAlign: 'center'}}>{t("news.table.publisher")}</span>
              {isLoggedIn && <span style={{textAlign: 'center'}}>{t("news.table.action")}</span>}
            </div>

            {newsData.map(news => (
              <div key={news.id} className={styles.newsRow} style={isLoggedIn ? { gridTemplateColumns: "110px 160px 1fr 100px 80px" } : {}}>
                <div className={styles.newsDate}>
                  <span className={styles.mobileLabel}>{t("news.table.publish_date")}:</span>
                  {news.createDate}
                </div>
                <div className={styles.newsTag}>
                  <Tags tags={news.tag} />
                </div>
                <div className={styles.newsContent}>
                  <Link to={`/news/${news.id}`} className={styles.linkText}>
                    {news.title}
                  </Link>
                </div>
                <div className={styles.newsPublisher}>
                  <span className={styles.mobileLabel}>{t("news.table.publisher")}:</span>
                  {news.publisher}
                </div>
                {isLoggedIn && (
                  <div className={styles.newsActions}>
                    <Link to={`/news/${news.id}?edit=true`} className={styles.iconBtn} title="Edit">
                      <Edit size={18} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Fragment>
  );
}