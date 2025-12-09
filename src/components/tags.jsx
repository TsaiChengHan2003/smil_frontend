import styles from "@/assets/styles/components/tags.module.scss";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function Tags({ tags }) {
  const { t } = useTranslation();
  const tagMap = useMemo(() => ({
    // 0: 一般/預設 - 藍灰色 (Slate)
    "0": { 
      label: t("tags.0"), 
      styles: { backgroundColor: "#64748b", color: "#ffffff" } 
    },
    // 1: 校友 - 淺琥珀色背景 (Amber-100)，深褐色文字 (確保可讀性)
    "1": { 
      label: t("tags.1"), 
      styles: { backgroundColor: "#fef3c7", color: "#92400e" } 
    },
    // 2: 國際期刊 - 翡翠綠 (Emerald)，代表高品質與通過同儕審查
    "2": { 
      label: t("tags.2"), 
      styles: { backgroundColor: "#059669", color: "#ffffff" } 
    },
    // 3: 國際研討會 - 科技藍 (Blue)，代表學術交流
    "3": { 
      label: t("tags.3"), 
      styles: { backgroundColor: "#3b82f6", color: "#ffffff" } 
    },
    // 4: 專利 - 創新紫 (Violet)，代表獨創性
    "4": { 
      label: t("tags.4"), 
      styles: { backgroundColor: "#8b5cf6", color: "#ffffff" } 
    },
    // 5: 獲獎 - 榮耀金 (Amber/Orange)，高亮顯示成就
    "5": { 
      label: t("tags.5"), 
      styles: { backgroundColor: "#f59e0b", color: "#ffffff" } 
    },
    // 6: 國內研討會 - 天空藍 (Sky)，比國際會議輕盈，做區隔
    "6": { 
      label: t("tags.6"), 
      styles: { backgroundColor: "#0ea5e9", color: "#ffffff" } 
    },
    // 7: 專書章節 - 靛青色 (Indigo)，代表深度知識
    "7": { 
      label: t("tags.7"), 
      styles: { backgroundColor: "#6366f1", color: "#ffffff" } 
    },
    // 8: 技術報告 - 深鐵灰 (Slate-700)，代表實作與技術細節
    "8": { 
      label: t("tags.8"), 
      styles: { backgroundColor: "#475569", color: "#ffffff" } 
    },
  }), [t]);

  // 如果沒有 tags，返回 null
  if (!tags) return null;
  
  // 將 tags 字串分割並過濾空值
  const tagArray = tags.split(",").filter(tag => tag.trim());
  
  // 如果分割後沒有有效的 tag，返回 null
  if (tagArray.length === 0) return null;

  return (
    <div className={styles.tagsWrapper}>
      <div className={styles.tagsContainer}>
        {tagArray.map((tag, index) => {
          const tagValue = tag.trim();
          const tagData = tagMap[tagValue] || tagValue; // 如果有對應就顯示對應文字，否則顯示原始值
          return (
            <span key={index} className={styles.tag} style={tagData.styles}>{tagData.label}</span>
          );
        })}
      </div>
    </div>
  );
}