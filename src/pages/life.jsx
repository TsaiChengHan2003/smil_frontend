import React, { useState, useEffect, useCallback } from "react";
import Fragment from "@/components/common/Fragment";
import { useTranslation } from "react-i18next";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "react-feather";
import styles from "@/assets/styles/components/life.module.scss";
import { life } from "@/datas/life";

export default function Life() {
  const { t } = useTranslation();
  const lifeData = t("life", { returnObjects: true });
  
  // 狀態：目前選中的相簿 (null 代表沒選)
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  // 狀態：目前輪播顯示第幾張照片
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // 這邊要串API拿資料
  const albums = life;

  // 開啟相簿
  const openAlbum = (album) => {
    if (!album.carousel || album.carousel.length === 0) return;
    setSelectedAlbum(album);
    setCurrentPhotoIndex(0);
    // 禁止背景捲動
    document.body.style.overflow = "hidden";
  };

  // 關閉相簿
  const closeAlbum = () => {
    setSelectedAlbum(null);
    setCurrentPhotoIndex(0);
    // 恢復背景捲動
    document.body.style.overflow = "auto";
  };

  // 切換下一張
  const nextPhoto = useCallback(() => {
    if (!selectedAlbum) return;
    setCurrentPhotoIndex((prev) => 
      prev === selectedAlbum.carousel.length - 1 ? 0 : prev + 1
    );
  }, [selectedAlbum]);

  // 切換上一張
  const prevPhoto = useCallback(() => {
    if (!selectedAlbum) return;
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? selectedAlbum.carousel.length - 1 : prev - 1
    );
  }, [selectedAlbum]);

  // 鍵盤監聽 (ESC關閉, 左右鍵切換)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedAlbum) return;
      if (e.key === "Escape") closeAlbum();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAlbum, nextPhoto, prevPhoto]);

  // 錯誤處理：如果資料格式不對
  if (!albums || !Array.isArray(albums)) {
    return null;
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{lifeData.title || "Life"}</h1>
        <p className={styles.pageDescription}>{lifeData.description}</p>

        {/* --- 相簿列表 (Grid) --- */}
        <div className={styles.albumGrid}>
          {albums.map((album, index) => {
            // 取第一張圖當封面，若無圖則顯示預設
            const coverImage = album.carousel?.[0]?.imageUrl;
            
            return (
              <div 
                key={album.id || index} 
                className={styles.albumCard}
                onClick={() => openAlbum(album)}
              >
                <div className={styles.coverWrapper}>
                  {coverImage ? (
                    <img src={coverImage} alt={album.title} className={styles.coverImage} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <ImageIcon size={48} color="#cbd5e1" />
                    </div>
                  )}
                  {/* 右上角顯示照片數量 */}
                  <span className={styles.photoCount}>
                    {album.carousel?.length || 0} 張
                  </span>
                </div>
                
                <div className={styles.albumInfo}>
                  <span className={styles.albumDate}>{album.date}</span>
                  <h3 className={styles.albumTitle}>{album.title}</h3>
                  <p className={styles.albumSubtitle}>{album.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- 全螢幕輪播 Modal --- */}
        {selectedAlbum && (
          <div className={styles.modalOverlay} onClick={closeAlbum}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              
              {/* 關閉按鈕 */}
              <button className={styles.closeButton} onClick={closeAlbum}>
                <X size={32} />
              </button>

              {/* 圖片區 */}
              <div className={styles.carouselContainer}>
                {selectedAlbum.carousel.map((photo, index) => (
                  <div 
                    key={index} 
                    className={`${styles.slide} ${index === currentPhotoIndex ? styles.active : ''}`}
                  >
                    <img src={photo.imageUrl} alt={photo.description} className={styles.slideImage} />
                    
                    {/* 左下角文字 (只顯示在當前圖片) */}
                    {index === currentPhotoIndex && (
                      <div className={styles.textOverlay}>
                        <p className={styles.description}>{photo.description}</p>
                        <span className={styles.counter}>
                          {index + 1} / {selectedAlbum.carousel.length}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 左右切換按鈕 */}
              <button className={`${styles.navButton} ${styles.prev}`} onClick={prevPhoto}>
                <ChevronLeft size={24} />
              </button>
              <button className={`${styles.navButton} ${styles.next}`} onClick={nextPhoto}>
                <ChevronRight size={24} />
              </button>

            </div>
          </div>
        )}

      </div>
    </Fragment>
  );
}