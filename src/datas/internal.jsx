// src/datas/internal.js

// 1. 公告設定 (使用 datetime 整合日期時間，移除手動 day)
export const meetingNoticeData = [
  {
    id: 1,
    datetime: "2025-12-01 09:30", // 格式: YYYY-MM-DD HH:mm
    type: "論文分享會",
    location: "系館B1多功能教室",
    staff: "蔡政翰、蔡汯劭",
    active: true 
  },
  {
    id: 2,
    datetime: "2025-12-04 10:00",
    type: "進度分享會",
    location: "誠樓114",
    staff: "李小美",
    active: true
  }
];

// 2. 本週輪值資料 (date 格式統一為 YYYY-MM-DD)
export const currentDutyData = [
  { 
    id: 1, 
    date: "2025-12-01", // 純日期，程式自動算星期
    time: "09:30",
    type: "論文分享",
    location: "系館B1",
    presenter: "蔡政翰", 
    paperTitle: "BERT: Pre-training of Deep Bidirectional Transformers", 
    paperUrl: "https://arxiv.org/abs/1810.04805", 
    slidesFile: "https://arxiv.org/abs/1810.04805" 
  },
  { 
    id: 2, 
    date: "2025-12-01", 
    time: "10:30",
    type: "論文分享",
    location: "系館B1",
    presenter: "蔡汯劭", 
    paperTitle: "Transformer-based Neural Machine Translation", 
    paperUrl: "https://arxiv.org/abs/1906.05849", 
    slidesFile: null 
  },
  { 
    id: 3, 
    date: "2025-12-04", 
    time: "10:00",
    type: "進度報告",
    location: "誠樓114",
    presenter: "陳小華", 
    paperTitle: "Language Models are Few-Shot Learners", 
    paperUrl: "https://arxiv.org/abs/2005.14165", 
    slidesFile: null 
  }
];

export const historyData = [
  // ... (歷史資料保持不變)
  { 
    id: 101, 
    date: "2024-02-28", 
    presenter: "張三", 
    paperTitle: "BERT: Pre-training of Deep Bidirectional Transformers", 
    paperUrl: "https://arxiv.org/abs/1810.04805", 
    slidesFile: "bert_slides.pdf" 
  },
  // ...
];