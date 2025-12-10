import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Fragment from "@/components/common/Fragment";
import Tags from "@/components/tags"; // ★ 修正路徑
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, Calendar, User } from "react-feather";
import styles from "@/assets/styles/components/newsDetail.module.scss";
import { newsData } from "@/datas/news";

export default function NewsDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. 權限檢查
  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {
    const auth = localStorage.getItem("user");
    setCanEdit(auth === "manager" || auth === "editor");
  }, []);

  // 2. 從資料源獲取初始資料
  const originalData = useMemo(() => {
    return newsData.find(item => item.id.toString() === id);
  }, [id]);

  const [displayData, setDisplayData] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  // 初始化資料
  useEffect(() => {
    if (originalData) {
      // 如果還沒有顯示資料，就用原始資料初始化
      if (!displayData) {
        setDisplayData(originalData);
      }
      
      // 設定表單預設值
      reset(originalData);

      // 根據 URL 參數決定是否進入編輯模式
      if (searchParams.get("edit") === "true" && canEdit) {
        setIsEditing(true);
      }
    }
  }, [originalData, searchParams, canEdit, reset, displayData]);

  // 錯誤處理：找不到資料
  if (!originalData) {
    return (
      <Fragment>
        <div className={styles.container}>
          <div className={styles.errorBox}>資料不存在或已被刪除</div>
          <Link to="/news" className={styles.backLink}><ArrowLeft size={16}/> 返回列表</Link>
        </div>
      </Fragment>
    );
  }

  // 等待資料載入防呆
  if (!displayData) return null;

  // --- Handlers ---

  const onSubmit = (data) => {
    // 這裡串接 API 更新資料
    // API.updateNews(id, data).then(...)
    
    alert("儲存成功！(模擬)");
    console.log("Form Submitted:", data);
    
    // 更新本地顯示資料 (模擬 API 回傳後的畫面更新)
    setDisplayData(data);
    
    setIsEditing(false);
    navigate(`/news/${id}`, { replace: true });
  };

  const handleCancel = () => {
    reset(displayData); // 將表單重置回目前的顯示資料
    setIsEditing(false);
    navigate("/news", { replace: true });
  };

  return (
    <Fragment>
      <div className={styles.container}>
        {/* 頂部導航列 */}
        <div className={styles.topBar}>
          <Link to="/news" className={styles.backLink}>
            <ArrowLeft size={20} /> 返回公告列表
          </Link>
          
          {/* 只有管理員能看到編輯切換鈕 */}
          {canEdit && !isEditing && (
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              <Edit2 size={16} /> 編輯公告
            </button>
          )}
        </div>

        <div className={styles.contentCard}>
          {/* ========== 編輯模式 (Form) ========== */}
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
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
                {errors.content && <span className={styles.errorMsg}>內容為必填</span>}
              </div>

              <div className={styles.actionButtons}>
                {/* 注意：取消按鈕 type="button" 避免觸發 submit */}
                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                  <X size={18} /> 取消
                </button>
                <button type="submit" className={styles.saveBtn}>
                  <Save size={18} /> 儲存變更
                </button>
              </div>
            </form>
          ) : (
            /* ========== 檢視模式 (View) ========== */
            <div className={styles.viewMode}>
              <header className={styles.articleHeader}>
                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <Calendar size={16} /> {displayData.createDate}
                  </span>
                  <span className={styles.metaItem}>
                    <User size={16} /> {displayData.publisher}
                  </span>
                  <div className={styles.metaTag}>
                    <Tags tags={displayData.tag} />
                  </div>
                </div>
                <h1 className={styles.articleTitle}>{displayData.title}</h1>
              </header>
              
              <hr className={styles.divider} />
              
              <article className={styles.articleBody}>
                {/* 簡單處理換行 */}
                {displayData.content && displayData.content.split('\n').map((line, i) => (
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