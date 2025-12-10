import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Fragment from "@/components/common/Fragment";
import Tags from "@/components/tags"; 
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, Calendar, User } from "react-feather";
import styles from "@/assets/styles/components/newsDetail.module.scss";
import { newsData } from "@/datas/news";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";

export default function NewsDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useGoogleAuth();
  const navigate = useNavigate();

  const isNew = id === "new";

  const currentData = useMemo(() => {
    if (isNew) return { title: "", publisher: "", createDate: "", tag: "10", content: "" };
    return newsData.find(item => item.id.toString() === id) || newsData[0];
  }, [id, isNew]);

  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (currentData) {
      reset(currentData);
      if ((isNew || searchParams.get("edit") === "true") && isLoggedIn) {
        setIsEditing(true);
      }
    }
  }, [currentData, isNew, searchParams, isLoggedIn, reset]);

  const onSubmit = (data) => {
    console.log("Updated News:", data);
    alert("送出成功");
    navigate("/news");
  };

  const handleCancel = () => {
    navigate("/news");
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/news" className={styles.backLink}>
            <ArrowLeft size={16} /> 返回列表
          </Link>
          {isLoggedIn && !isEditing && !isNew && (
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              <Edit2 size={16} /> 編輯
            </button>
          )}
        </div>

        <div className={styles.contentCard}>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
              <h2 className={styles.formTitle}>
                {isNew ? "新增公告" : "編輯公告"}
              </h2>

              <div className={styles.formGrid}>
                {/* 標題佔滿 */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>標題 (Subject)</label>
                  <input className={styles.input} {...register("title", { required: true })} />
                  {errors.title && <span className={styles.errorMsg}>必填</span>}
                </div>

                {/* 資訊列：發佈人、日期、Tag */}
                <div className={styles.formGroup}>
                  <label>發佈人</label>
                  <input className={styles.input} {...register("publisher")} />
                </div>
                <div className={styles.formGroup}>
                  <label>日期</label>
                  <input type="date" className={styles.input} {...register("createDate")} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>分類 (Tag)</label>
                  <select className={styles.select} {...register("tag")}>
                    <option value="9">重要 (9)</option>
                    <option value="10">日常 (10)</option>
                    <option value="11">獲獎 (11)</option>
                    <option value="12">其他 (12)</option>
                  </select>
                </div>

                {/* 內文 */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>內文 (Content)</label>
                  <textarea className={styles.textarea} {...register("content")} />
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                  <X size={16} /> 取消
                </button>
                <button type="submit" className={styles.saveBtn}>
                  <Save size={16} /> 儲存
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.viewMode}>
              <header className={styles.articleHeader}>
                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <Calendar size={16} /> {currentData.createDate}
                  </span>
                  <span className={styles.metaItem}>
                    <User size={16} /> {currentData.publisher}
                  </span>
                  <Tags tags={currentData.tag} />
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