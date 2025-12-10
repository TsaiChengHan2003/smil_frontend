import React, { useState, useEffect, useMemo } from "react";
import Fragment from "@/components/common/Fragment";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Users, Clock, FileText, Monitor, CheckCircle, Upload, Bell, Edit2, Save, MapPin, Calendar, X, File, ChevronLeft, ChevronRight, User, Plus, Trash2 } from "react-feather";
import styles from "@/assets/styles/components/internal.module.scss";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";
import { currentDutyData, historyData, meetingNoticeData } from "@/datas/internal";

export default function Internal() {
  const { t } = useTranslation();
  const { isLoggedIn } = useGoogleAuth();
  const navigate = useNavigate();

  // 1. 權限檢查
  useEffect(() => {
    if (!localStorage.getItem("authority")) {
        // navigate("/");
    }
  }, [navigate]);

  // 2. 狀態管理
  const [duties, setDuties] = useState(currentDutyData);
  const [notice, setNotice] = useState(meetingNoticeData);
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [activeUploadId, setActiveUploadId] = useState(null);
  const [paperInput, setPaperInput] = useState({ title: "", url: "" });

  const getDayOfWeek = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.split(" ")[0]); 
    if (isNaN(date.getTime())) return "";
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    return `（${days[date.getDay()]}）`;
  };

  // 取得該日期的會議時間 (從公告中找)
  const getMeetingTime = (dateKey) => {
    const targetNotice = notice.find(n => n.datetime.startsWith(dateKey));
    if (!targetNotice) return "";
    return targetNotice.datetime.split(" ")[1]; // 取出 HH:mm
  };

  const handleNoticeChange = (index, field, value) => {
    const updated = [...notice];
    updated[index] = { ...updated[index], [field]: value };
    setNotice(updated);
  };

  const addNotice = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const defaultTime = now.toISOString().slice(0, 16); 
    setNotice([...notice, { id: Date.now(), datetime: defaultTime, day: "", type: "", location: "", staff: "", active: true }]);
  };

  const removeNotice = (index) => {
    if (window.confirm("確定刪除？")) {
      const updated = [...notice];
      updated.splice(index, 1);
      setNotice(updated);
    }
  };

  const saveNotice = () => {
    setIsEditingNotice(false);
    alert("公告更新成功！");
  };

  const activeStatusMap = useMemo(() => {
    const map = {};
    notice.forEach(item => {
      const datePart = item.datetime ? item.datetime.split(" ")[0] : "";
      if (datePart) map[datePart] = item.active;
    });
    return map;
  }, [notice]);

  const groupedDuties = useMemo(() => {
    const groups = {};
    duties.forEach(item => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    });
    return groups;
  }, [duties]);

  const openPaperUpload = (id) => {
    setActiveUploadId(id);
    setPaperInput({ title: "", url: "" });
  };

  const submitPaperUpload = (id) => {
    if (!paperInput.url) {
      alert("請輸入連結！");
      return;
    }
    setDuties(prev => prev.map(item => 
      item.id === id ? { ...item, paperUrl: paperInput.url, paperTitle: paperInput.title || "Untitled Paper" } : item
    ));
    setActiveUploadId(null);
  };

  const handleSlideUpload = (id, file) => {
    if (!file) return;
    setDuties(prev => prev.map(item => item.id === id ? { ...item, slidesFile: file.name } : item));
    alert("上傳成功");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return historyData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage]);
  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  if (!isLoggedIn) return null;

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t("internal.title")}</h1>
          <p className={styles.pageDescription}>{t("internal.description")}</p>
        </div>

        {/* 1. 公告欄 (保持不變) */}
        <div className={styles.announcementBoard}>
          <div className={styles.boardHeader}>
            <h2><Bell size={24} /> {t("internal.notice_title")}</h2>
            {isLoggedIn && !isEditingNotice && (
              <button className={styles.editNoticeBtn} onClick={() => setIsEditingNotice(true)}>
                <Edit2 size={16} /> 編輯公告
              </button>
            )}
          </div>
          {isEditingNotice ? (
            <div className={styles.editBoardForm}>
              {notice.map((item, idx) => (
                <div key={idx} className={styles.editRowCompact}>
                  <div style={{justifySelf: 'center'}}>
                    <input type="checkbox" checked={item.active} onChange={(e) => handleNoticeChange(idx, 'active', e.target.checked)} />
                  </div>
                  <input type="datetime-local" value={item.datetime ? item.datetime.replace(" ", "T") : ""} onChange={(e) => handleNoticeChange(idx, 'datetime', e.target.value.replace("T", " "))} />
                  <span style={{color: '#64748b', fontSize: '0.9rem', textAlign: 'center'}}>{getDayOfWeek(item.datetime)}</span>
                  <input type="text" placeholder="內容" value={item.type} onChange={(e) => handleNoticeChange(idx, 'type', e.target.value)} className={styles.fullWidthMobile} />
                  <input type="text" placeholder="地點" value={item.location} onChange={(e) => handleNoticeChange(idx, 'location', e.target.value)} className={styles.fullWidthMobile} />
                  <input type="text" placeholder="負責人" value={item.staff} onChange={(e) => handleNoticeChange(idx, 'staff', e.target.value)} className={styles.fullWidthMobile} />
                  <button className={styles.deleteBtn} onClick={() => removeNotice(idx)}><Trash2 size={16} /></button>
                </div>
              ))}
              <div className={styles.toolbar}>
                <button className={styles.addBtn} onClick={addNotice}><Plus size={16} /> 新增會議</button>
                <button className={styles.saveBtn} onClick={saveNotice}><Save size={18} /> 儲存設定</button>
              </div>
            </div>
          ) : (
            <div className={styles.noticeList}>
              {notice.map((item, idx) => {
                const timePart = item.datetime ? item.datetime.split(" ")[1] : "";
                const datePart = item.datetime ? item.datetime.split(" ")[0] : "";
                return (
                  <div key={idx} className={`${styles.compactNoticeRow} ${!item.active ? styles.canceled : ''}`}>
                    <div className={styles.statusDot}></div>
                    <div className={styles.noticeDate}>{datePart} {getDayOfWeek(item.datetime)} {timePart}</div>
                    {item.active ? (
                      <div className={styles.noticeInfo}>
                        <span><strong>{item.type}</strong></span>
                        <span>@ {item.location}</span>
                        {item.staff && <span className={styles.noticeStaff}><User size={12} style={{marginRight:4}} />{item.staff}</span>}
                      </div>
                    ) : (
                      <div className={styles.noticeInfo}><span>本次會議已取消</span></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. 本週輪值 */}
        <section>
          <div className={styles.sectionTitle}>
            <Users size={24} /> {t("internal.duty_title")}
          </div>

          <div className={styles.dutyList}>
            {Object.keys(groupedDuties).sort().map(dateKey => {
              const list = groupedDuties[dateKey];
              const isActive = activeStatusMap[dateKey] !== false;
              const dayLabel = getDayOfWeek(dateKey);

              return (
                <div key={dateKey} style={{marginBottom: '2rem'}}> {/* 包覆 div 用來撐開距離 */}
                  
                  {/* 日期標題 Group Header */}
                  <div className={styles.dayHeader}>
                    <Calendar size={18} /> {dateKey} {dayLabel}
                    {!isActive && <span style={{color: '#ef4444', marginLeft: 'auto', fontSize: '0.9rem'}}>(停開)</span>}
                  </div>

                  {/* ★ 表格標頭 (List Header) - 確保有 5 個 span */}
                  <div className={styles.dutyHeader}>
                    <span>{t("internal.table.presenter")}</span>   {/* 2. 報告者 */}
                    <span>{t("internal.table.detail")}</span>      {/* 3. 詳細資訊 */}
                    <span>{t("internal.table.paper")}</span>{/* 4. 論文 */}
                    <span>{t("internal.table.slides")}</span>      {/* 5. 簡報 */}
                  </div>

                  {/* 列表內容 */}
                  {list.map((item) => (
                    <div key={item.id} className={`${styles.dutyRowCompact} ${!isActive ? styles.disabled : ''}`}>
                      
                      {/* 2. 報告者 */}
                      <div className={styles.presenterName}>
                        {item.presenter}
                      </div>

                      {/* 3. 詳細資訊 */}
                      <div className={styles.dutyMeta}>
                        <div className={`${styles.metaItem} type`}>{item.type}</div>
                        <div className={styles.metaItem}><MapPin size={14} className="loc" /> {item.location}</div>
                      </div>

                      {/* 4. Paper Upload */}
                      <div className={styles.uploadAction}>
                        {item.paperUrl ? (
                          <a href={item.paperUrl} target="_blank" rel="noreferrer" className={`${styles.uploadStatus} ${styles.done}`} title={item.paperTitle}>
                            <CheckCircle size={16} />
                            <span className={styles.paperLinkText}>
                              {item.paperTitle || "Link"}
                            </span>
                          </a>
                        ) : activeUploadId === item.id ? (
                          <div className={styles.inlineInput}>
                            <input 
                              type="text" 
                              placeholder="Title..." 
                              value={paperInput.title}
                              onChange={(e) => setPaperInput(prev => ({...prev, title: e.target.value}))}
                              autoFocus 
                            />
                            <input 
                              type="text" 
                              placeholder="URL..." 
                              value={paperInput.url}
                              onChange={(e) => setPaperInput(prev => ({...prev, url: e.target.value}))}
                            />
                            <div className={styles.btnGroup}>
                              <button className={styles.close} onClick={() => setActiveUploadId(null)}>Cancel</button>
                              <button onClick={() => submitPaperUpload(item.id)}>OK</button>
                            </div>
                          </div>
                        ) : (
                          <div className={`${styles.uploadStatus} ${styles.empty}`} onClick={() => openPaperUpload(item.id)}>
                            <Upload size={14} /> Link
                          </div>
                        )}
                      </div>

                      {/* 5. Slides Upload */}
                      <div className={styles.colSlidesAction}>
                        {item.slidesFile ? (
                          <a 
                            href="#" 
                            className={styles.slideTag} 
                            title={item.slidesFile}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`下載: ${item.slidesFile}`);
                            }}
                          >
                            <File size={14} /> PPT
                          </a>
                        ) : (
                          <label className={`${styles.uploadStatus} ${styles.empty}`}>
                            <input type="file" style={{display: 'none'}} onChange={(e) => handleSlideUpload(item.id, e.target.files[0])} />
                            <Upload size={14} /> Upload
                          </label>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        {/* ... (History 保持不變) ... */}
         {/* 3. 歷史紀錄 */}
         <section>
          <div className={styles.sectionTitle}>
            <Clock size={24} /> {t("internal.history_title")}
          </div>
          <div className={styles.historyTableContainer}>
            <div className={styles.historyHeader}>
              <span>{t("internal.table.date")}</span>
              <span>{t("internal.table.presenter")}</span>
              <span>{t("internal.table.paper")}</span>
              <span style={{textAlign: 'right'}}>{t("internal.table.slides")}</span>
            </div>
            {paginatedHistory.map(row => (
              <div key={row.id} className={styles.historyRow}>
                <div className={styles.colDate}><span className={styles.mobileLabel}>{t("internal.table.date")}:</span>{row.date}</div>
                <div className={styles.colPresenter}><span className={styles.mobileLabel}>{t("internal.table.presenter")}:</span>{row.presenter}</div>
                <div className={styles.colPaper}>
                  <a href={row.paperUrl} target="_blank" rel="noreferrer" className={styles.paperLink} title={row.paperTitle}>{row.paperTitle}</a>
                </div>
                <div className={styles.colSlides}>
                  {row.slidesFile ? <a href="#" className={styles.slideTag} onClick={(e)=>{e.preventDefault(); alert("download")}}><File size={14} /> PPT</a> : <span style={{color:'#cbd5e1'}}>-</span>}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16} /></button>
              <span>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16} /></button>
            </div>
          )}
        </section>

      </div>
    </Fragment>
  );
}