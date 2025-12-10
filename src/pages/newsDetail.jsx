import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Fragment from "@/components/common/Fragment";
import Tags from "@/components/tags"; 
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, Calendar, User } from "react-feather";
import styles from "@/assets/styles/components/newsDetail.module.scss";
import { newsData } from "@/datas/news";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";

export default function NewsDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useGoogleAuth();
  const navigate = useNavigate();

  // 1. 抓取資料 (若 ID 找不到，直接硬接第一筆假資料)
  const currentData = useMemo(() => {
    if (id === "new") return { title: "", publisher: "", createDate: "", tag: "10", content: "" };
    return newsData.find(item => item.id.toString() === id) || newsData[0];
  }, [id]);

  // 2. 狀態管理
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 3. 初始化：將資料填入表單
  useEffect(() => {
    if (currentData) {
      reset(currentData);
      // 如果網址有 ?edit=true 且已登入，進入編輯模式
      if ((id === "new" || searchParams.get("edit") === "true") && isLoggedIn) {
        setIsEditing(true);
      }
    }
  }, [currentData, id, searchParams, isLoggedIn, reset]);

  // 4. 送出 (僅印出 Log，您之後再接 API)
  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    alert("送出成功 (請看 Console)");
    setIsEditing(false); 
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/news" className={styles.backLink}>
            <ArrowLeft size={20} /> 返回公告列表
          </Link>
          
          {/* 只有登入且非編輯模式顯示按鈕 */}
          {isLoggedIn && !isEditing && id !== "new" && (
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              <Edit2 size={16} /> 編輯公告
            </button>
          )}
        </div>

        <div className={styles.contentCard}>
          {isEditing ? (
            /* ========== 編輯模式 ========== */
            <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
              <h2 className={styles.articleTitle} style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                {id === "new" ? "新增公告" : "編輯公告"}
              </h2>

              <div className={styles.formGroup}>
                <label>標題</label>
                <input 
                  type="text" 
                  className={styles.input}
                  {...register("title", { required: true })}
                />
                {errors.title && <span className={styles.errorMsg}>標題為必填</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>發佈人</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    {...register("publisher", { required: true })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>日期</label>
                  <input 
                    type="date" 
                    className={styles.input}
                    {...register("createDate", { required: true })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>分類 Tag</label>
                  <select className={styles.select} {...register("tag")}>
                    <option value="9">重要 (9)</option>
                    <option value="10">日常 (10)</option>
                    <option value="11">獲獎 (11)</option>
                    <option value="12">其他 (12)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>內文</label>
                <textarea 
                  rows="10" 
                  className={styles.textarea}
                  {...register("content", { required: true })}
                />
              </div>

              <div className={styles.actionButtons}>
                <button type="button" className={styles.cancelBtn} onClick={() => navigate("/news", { replace: true })}>
                  <X size={18} /> 取消
                </button>
                <button type="submit" className={styles.saveBtn}>
                  <Save size={18} /> 儲存
                </button>
              </div>
            </form>
          ) : (
            /* ========== 檢視模式 (直接讀取 currentData) ========== */
            <div className={styles.viewMode}>
              <header className={styles.articleHeader}>
                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <Calendar size={16} /> {currentData.createDate}
                  </span>
                  <span className={styles.metaItem}>
                    <User size={16} /> {currentData.publisher}
                  </span>
                  <div className={styles.metaTag}>
                    <Tags tags={currentData.tag} />
                  </div>
                </div>
                <h1 className={styles.articleTitle}>{currentData.title}</h1>
              </header>
              
              <hr className={styles.divider} />
              
              <article className={styles.articleBody}>
                {currentData.content && currentData.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </article>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}