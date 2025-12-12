import React, { useState } from "react";
import Fragment from "@/components/common/Fragment";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown } from "react-feather";
import styles from "@/assets/styles/components/research.module.scss";

export default function Research() {
  const { t } = useTranslation();
  
  const research = t("research", { returnObjects: true });
  const categories = research?.content || research?.contents;

  // 狀態管理：記錄哪些區塊是展開的 (key: index, value: boolean)
  // 預設全部展開 (true)，如果希望預設全部收合，這裡可以設為 {}
  const [expandedSections, setExpandedSections] = useState(() => {
    if (!categories) return {};
    const initialState = {0: true};
    return initialState;
  });

  // 切換收合狀態的函式
  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index], // 取反
    }));
  };

  if (!categories || !Array.isArray(categories)) {
    return (
      <Fragment>
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            <h2>資料載入錯誤</h2>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{research.description || "相關研究"}</h1>
        
        {categories.map((category, index) => {
          const isExpanded = expandedSections[index];

          return (
            <section 
              key={category.id || index} 
              className={styles.categorySection}
              data-theme={category.id} // 綁定顏色主題
            >
              {/* 可點擊的標題區 */}
              <div 
                className={`${styles.categoryHeader} ${!isExpanded ? styles.isCollapsed : ''}`}
                onClick={() => toggleSection(index)}
              >
                <div className={styles.headerLeft}>
                  <h2 className={styles.categoryTitle}>{category.title}</h2>
                  <p className={styles.categoryDescription}>{category.description}</p>
                </div>
                <ChevronDown size={24} className={styles.toggleIcon} />
              </div>
              
              {/* 滑動動畫容器 */}
              <div className={`${styles.collapsibleWrapper} ${!isExpanded ? styles.collapsed : ''}`}>
                <div className={styles.innerContent}>
                  <div className={styles.subtitlesGrid}>
                    {category.subtitles && category.subtitles.map((subtitle, subtitleIndex) => (
                      <Link
                        key={subtitle.url || subtitleIndex}
                        to={subtitle.url || "#"}
                        className={styles.subtitleCard}
                      >
                        <div className={styles.subtitleImageWrapper}>
                          {subtitle.imageUrl ? (
                            <img 
                              src={subtitle.imageUrl} 
                              alt={subtitle.label}
                              className={styles.subtitleImage}
                              onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          
                          {/* Placeholder */}
                          <div 
                            className={styles.imagePlaceholder} 
                            style={{ display: subtitle.imageUrl ? "none" : "flex" }}
                          >
                            <span>{subtitle.label}</span>
                          </div>
                        </div>
                        
                        <div className={styles.subtitleContent}>
                          <h3 className={styles.subtitleLabel}>{subtitle.label}</h3>
                          <p className={styles.subtitlePreview}>{subtitle.content}</p>
                          <div className={styles.subtitleFooter}>
                            <span className={styles.readMore}>
                              更多 <ChevronRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </Fragment>
  );
}