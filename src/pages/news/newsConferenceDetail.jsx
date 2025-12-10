import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Fragment from "@/components/common/Fragment";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, Calendar, MapPin, Clock, Globe } from "react-feather";
import styles from "@/assets/styles/components/newsDetail.module.scss"; 
import { mockConferences } from "@/datas/news";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";

export default function ConferenceDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useGoogleAuth();
  const navigate = useNavigate();

  const isNew = id === "new";

  const currentData = useMemo(() => {
    if (isNew) return { title: "", location: "", deadline: "", date: "", url: "" };
    return mockConferences.find(item => item.id.toString() === id) || mockConferences[0];
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
    console.log("Updated Conference:", data);
    alert("儲存成功");
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
                {isNew ? "新增會議資訊" : "編輯會議資訊"}
              </h2>
              
              {/* 使用 Grid 讓表單緊湊 */}
              <div className={styles.formGrid}>
                {/* 第一行：會議名稱 + 官網連結 */}
                <div className={styles.formGroup}>
                  <label>會議名稱 (Title)</label>
                  <input className={styles.input} {...register("title", { required: true })} />
                  {errors.title && <span className={styles.errorMsg}>必填</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>官網連結 (URL)</label>
                  <input className={styles.input} {...register("url")} placeholder="https://..." />
                </div>

                {/* 第二行：地點 (佔滿) */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>地點 (Location)</label>
                  <input className={styles.input} {...register("location", { required: true })} />
                </div>

                {/* 第三行：日期 */}
                <div className={styles.formGroup}>
                  <label>截稿日期 (Deadline)</label>
                  <input type="date" className={styles.input} {...register("deadline")} />
                </div>
                <div className={styles.formGroup}>
                  <label>舉辦日期 (Date)</label>
                  <input type="text" className={styles.input} {...register("date")} />
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
              <h1 className={styles.articleTitle}>{currentData.title}</h1>
              <hr className={styles.divider} />
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Globe size={20} color="#4e6fae" /> 
                  <strong>Website:</strong> 
                  <a href={currentData.url} target="_blank" rel="noreferrer" className={styles.urlLink}>{currentData.url}</a>
                </div>
                <div className={styles.infoItem}>
                  <MapPin size={20} color="#475569" /> 
                  <strong>Location:</strong> {currentData.location}
                </div>
                <div className={styles.infoItem}>
                  <Clock size={20} color="#ef4444" /> 
                  <strong>Deadline:</strong> 
                  <span style={{color:'#ef4444', fontWeight:'bold'}}>{currentData.deadline}</span>
                </div>
                <div className={styles.infoItem}>
                  <Calendar size={20} color="#475569" /> 
                  <strong>Date:</strong> {currentData.date}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}