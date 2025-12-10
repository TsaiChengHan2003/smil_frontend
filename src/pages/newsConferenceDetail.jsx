import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Fragment from "@/components/common/Fragment";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, Calendar, MapPin, Clock } from "react-feather";
import styles from "@/assets/styles/components/newsDetail.module.scss"; 
import { mockConferences } from "@/datas/news";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";

export default function ConferenceDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useGoogleAuth();
  const navigate = useNavigate();

  // 1. 抓取資料 (若 ID 找不到，硬接第一筆)
  const currentData = useMemo(() => {
    if (id === "new") return { title: "", location: "", deadline: "", date: "" };
    return mockConferences.find(item => item.id.toString() === id) || mockConferences[0];
  }, [id]);

  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 2. 初始化
  useEffect(() => {
    if (currentData) {
      reset(currentData);
      if ((id === "new" || searchParams.get("edit") === "true") && isLoggedIn) {
        setIsEditing(true);
      }
    }
  }, [currentData, id, searchParams, isLoggedIn, reset]);

  // 3. 送出
  const onSubmit = (data) => {
    console.log("Conference Data Submitted:", data);
    alert("送出成功 (請看 Console)");
    setIsEditing(false);
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/news" className={styles.backLink}>
            <ArrowLeft size={20} /> 返回列表
          </Link>
          {isLoggedIn && !isEditing && id !== "new" && (
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              <Edit2 size={16} /> 編輯
            </button>
          )}
        </div>

        <div className={styles.contentCard}>
          {isEditing ? (
            /* ========== 編輯模式 ========== */
            <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
              <h2 className={styles.articleTitle} style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
                {id === "new" ? "新增會議" : "編輯會議資訊"}
              </h2>
              
              <div className={styles.formGroup}>
                <label>會議名稱</label>
                <input className={styles.input} {...register("title", { required: true })} />
                {errors.title && <span className={styles.errorMsg}>必填</span>}
              </div>

              <div className={styles.formGroup}>
                <label>地點</label>
                <input className={styles.input} {...register("location")} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>截稿日期 (Deadline)</label>
                  <input type="date" className={styles.input} {...register("deadline")} />
                </div>
                <div className={styles.formGroup}>
                  <label>舉辦日期</label>
                  <input type="text" className={styles.input} {...register("date")} />
                </div>
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
            /* ========== 檢視模式 ========== */
            <div className={styles.viewMode}>
              <h1 className={styles.articleTitle}>{currentData.title}</h1>
              <hr className={styles.divider} />
              
              <div className={styles.articleBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: '#475569' }}>
                    <MapPin size={24} color="#4e6fae" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#94a3b8' }}>LOCATION</strong>
                      {currentData.location}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: '#475569' }}>
                    <Clock size={24} color="#ef4444" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#94a3b8' }}>SUBMISSION DEADLINE</strong>
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{currentData.deadline}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: '#475569' }}>
                    <Calendar size={24} color="#4e6fae" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#94a3b8' }}>CONFERENCE DATE</strong>
                      {currentData.date}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}