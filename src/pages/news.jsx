import React, { useState, useEffect } from "react";
import Fragment from "@/components/common/Fragment";
import Tags from "@/components/tags"; // ★ 修正 import 路徑
import { useTranslation } from "react-i18next";
import { Monitor, Edit, Calendar, MapPin } from "react-feather";
import { Link } from "react-router-dom";
import styles from "@/assets/styles/components/news.module.scss";
import { newsData, mockConferences } from "@/datas/news";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";

export default function News() {
  const { t } = useTranslation();
  const { isLoggedIn } = useGoogleAuth()

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{t("news.title")}</h1>
        <p className={styles.pageDescription}>{t("news.description")}</p>

        <section>
          <div className={styles.sectionTitle}>
            <Calendar size={24} /> {t("news.sections.conference")}
          </div>
          
          <div className={styles.listContainer}>
            {/* 標題列 */}
            <div className={`${styles.listHeader} ${styles.conf}`}>
              <span>{t("news.table.deadline")}</span>
              <span>{t("news.table.conference")}</span>
              <span>{t("news.table.location")}</span>
              <span style={{textAlign: 'right'}}>{t("news.table.conf_date")}</span>
            </div>

            {mockConferences.map(conf => (
              <div key={conf.id} className={styles.confRow}>
                {/* 截稿日 */}
                <div className={styles.confDeadline}>
                  <span className={styles.mobileLabel}>{t("news.table.deadline")}:</span>
                  <span className={styles.deadlineDate}>{conf.deadline}</span>
                </div>

                {/* 會議名稱 */}
                <div className={styles.confTitle}>
                  {conf.title}
                </div>

                {/* 地點 */}
                <div className={styles.confLocation}>
                  <MapPin size={16} />
                  {conf.location}
                </div>

                {/* 舉辦日期 */}
                <div className={styles.confDate}>
                  <span className={styles.mobileLabel}>{t("news.table.conf_date")}:</span>
                  <Calendar size={16} />
                  {conf.date}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 普通公告 */}
        <section>
          <div className={styles.sectionTitle}>
            <Monitor size={24} /> {t("news.sections.general")}
          </div>
          
          <div className={styles.listContainer}>
            {/* 標題列：如果有權限，動態加入 Action 欄位 style */}
            <div 
              className={`${styles.listHeader} ${styles.news}`}
              style={isLoggedIn ? { gridTemplateColumns: "110px 160px 1fr 100px 80px" } : {}}
            >
              <span>{t("news.table.publish_date")}</span>
              <span style={{textAlign: 'center'}}>{t("news.table.category")}</span>
              <span>{t("news.table.subject")}</span>
              <span style={{textAlign: 'center'}}>{t("news.table.publisher")}</span>
              {isLoggedIn && <span style={{textAlign: 'center'}}>Action</span>}
            </div>

            {newsData.map(news => (
              <div 
                key={news.id} 
                className={styles.newsRow}
                style={isLoggedIn ? { gridTemplateColumns: "110px 160px 1fr 100px 80px" } : {}}
              >
                <div className={styles.newsDate}>
                  <span className={styles.mobileLabel}>{t("news.table.publish_date")}:</span>
                  {news.createDate}
                </div>
                
                <div className={styles.newsTag}>
                  {/* 使用正確路徑的 Tags 組件 */}
                  <Tags tags={news.tag} />
                </div>
                
                {/* 標題：點擊進入詳情頁 (View Mode) */}
                <div className={styles.newsContent}>
                  <Link to={`/news/${news.id}`} className={styles.linkText}>
                    {news.title}
                  </Link>
                </div>
                
                <div className={styles.newsPublisher}>
                  <span className={styles.mobileLabel}>{t("news.table.publisher")}:</span>
                  {news.publisher}
                </div>

                {/* 編輯按鈕：只有管理員看得到 */}
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