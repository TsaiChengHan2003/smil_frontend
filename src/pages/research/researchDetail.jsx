import React, { useMemo } from "react"; // 加入 useMemo 優化效能
import Fragment from "@/components/common/Fragment";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import styles from "@/assets/styles/components/research.module.scss";

export default function ResearchDetail() {
  const { t } = useTranslation();
  const { url } = useParams();
  
  // 取得翻譯檔案
  const research = t("research", { returnObjects: true });

  // 1. 查找對應的研究項目 (使用 useMemo 避免每次 render 都重算)
  const researchItem = useMemo(() => {
    // 兼容處理：確保讀得到 content 或 contents
    const categories = research?.content || research?.contents;

    if (!categories || !Array.isArray(categories)) {
      return null;
    }
    
    for (const category of categories) {
      if (category.subtitles && Array.isArray(category.subtitles)) {
        const item = category.subtitles.find(subtitle => {
          // 比對 URL：移除前綴後比對，例如 "/research/lvcsr" -> "lvcsr"
          const subtitleUrlPath = subtitle.url?.split("/").pop(); 
          return subtitleUrlPath === url;
        });

        if (item) {
          return { 
            ...item, 
            categoryTitle: category.title,
            // ★ 關鍵修復：把 category 的 id 帶出來，用於 CSS 配色
            categoryId: category.id 
          };
        }
      }
    }
    return null;
  }, [research, url]);

  // 找不到資料時的顯示
  if (!researchItem) {
    return (
      <Fragment>
        <div className={styles.container}>
          <Link to="/research" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>返回研究列表</span>
          </Link>
          <div className={styles.errorMessage}>
            <h2>找不到該研究項目</h2>
            <p>請檢查網址是否正確</p>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {/* ★ 關鍵修復：這裡加上 data-theme，讓內頁也能吃到對應的顏色變數 */}
      <div className={styles.container} data-theme={researchItem.categoryId}>
        
        <Link to="/research" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>返回研究列表</span>
        </Link>
        
        <article className={styles.detailArticle}>
          <div className={styles.detailHeader}>
            {/* 這個標籤背景會自動變色 */}
            <div className={styles.detailCategory}>
              {researchItem.categoryTitle}
            </div>
            
            <h1 className={styles.detailTitle}>{researchItem.label}</h1>
            
            {researchItem.en_label && researchItem.en_label !== researchItem.label && (
              <h2 className={styles.detailEnTitle}>{researchItem.en_label}</h2>
            )}
          </div>
          
          {researchItem.imageUrl && (
            <div className={styles.detailImageWrapper}>
              <img 
                src={researchItem.imageUrl} 
                alt={researchItem.label}
                className={styles.detailImage}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          
          <div className={styles.detailContent}>
            <section className={styles.detailSection}>
              {/* 這個標題底線會自動變色 */}
              <h3 className={styles.sectionTitle}>研究內容</h3>
              <p className={styles.sectionContent}>{researchItem.content}</p>
            </section>
            
            {researchItem.application && (
              <section className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>應用領域</h3>
                <p className={styles.sectionContent}>{researchItem.application}</p>
              </section>
            )}
          </div>
        </article>
      </div>
    </Fragment>
  );
}