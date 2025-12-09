import styles from "@/assets/styles/components/tags.module.scss";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function Tags({ tags }) {
  const { t } = useTranslation();
  const tagMap = useMemo(() => ({
    "0": { "label": t("tags.0"), "styles": { "backgroundColor": "#526480" } },
    "1": { "label": t("tags.1"), "styles": { "backgroundColor": "#f7e7a7ff" } },
    "2": { "label": t("tags.2"), "styles": { "backgroundColor": "#526480" } },
    "3": { "label": t("tags.3"), "styles": { "backgroundColor": "#526480" } },
    "4": { "label": t("tags.4"), "styles": { "backgroundColor": "#526480" } },
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