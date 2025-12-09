import React, { useState, useMemo } from "react";
import Fragment from "@/components/common/Fragment";
import Tags from "@/components/tags";
import { useTranslation } from "react-i18next";
import { Search, FileText, GitHub, ExternalLink } from "react-feather";
import styles from "@/assets/styles/components/achievements.module.scss";
import { achievements } from "@/datas/achievememts";

export default function Achievements() {
  const { t } = useTranslation();
  const data = t("achievements", { returnObjects: true });

  // 這邊要串API拿資料
  const papers = achievements;

  const [filterYear, setFilterYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. 提取年份
  const years = useMemo(() => {
    const allYears = papers.map(p => p.year);
    return [...new Set(allYears)].sort((a, b) => b - a);
  }, [papers]);

  // 2. 篩選資料
  const filteredPapers = useMemo(() => {
    return papers.filter(item => {
      const matchYear = filterYear === "all" || item.year === filterYear;
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        item.title.toLowerCase().includes(query) ||
        item.venue?.toLowerCase().includes(query) ||
        (Array.isArray(item.authors) && item.authors.join(" ").toLowerCase().includes(query));

      return matchYear && matchSearch;
    });
  }, [papers, filterYear, searchQuery]);

  // 3. 分組
  const groupedPapers = useMemo(() => {
    const groups = {};
    filteredPapers.forEach(paper => {
      if (!groups[paper.year]) groups[paper.year] = [];
      groups[paper.year].push(paper);
    });
    return Object.keys(groups)
      .sort((a, b) => b - a)
      .map(year => ({ year, list: groups[year] }));
  }, [filteredPapers]);

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{data.title || "Research Achievements"}</h1>
        <p className={styles.pageDescription}>{data.description}</p>

        {/* --- 搜尋與過濾區 --- */}
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search size={16} />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder={data.filters?.search_placeholder || "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <button 
              className={`${styles.filterBtn} ${filterYear === "all" ? styles.active : ''}`}
              onClick={() => setFilterYear("all")}
            >
              {data.filters?.all || "All Years"}
            </button>
            {years.map(year => (
              <button 
                key={year}
                className={`${styles.filterBtn} ${filterYear === year ? styles.active : ''}`}
                onClick={() => setFilterYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* --- 列表顯示區 --- */}
        <div className={styles.listContainer}>
          {groupedPapers.length > 0 ? (
            groupedPapers.map((group) => (
              <div key={group.year} className={styles.yearGroup}>
                <h2 className={styles.yearLabel}>{group.year}</h2>
                
                {group.list.map((paper, index) => (
                  <div key={paper.id || index} className={styles.paperRow}>
                    
                    <div className={styles.rowLeft}>
                      <Tags tags={paper.tags} />
                    </div>

                    {/* 中間：內容 */}
                    <div className={styles.rowMain}>
                      <h3 className={styles.paperTitle}>{paper.title}</h3>
                      <div className={styles.paperMeta}>
                        {paper.venue && <span className={styles.venueText}>{paper.venue}</span>}
                        <span className={styles.authors}>
                          {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors}
                        </span>
                      </div>
                    </div>

                    {/* 右側：下載連結 */}
                    <div className={styles.rowActions}>
                      {paper.links?.pdf && (
                        <a href={paper.links.pdf} target="_blank" rel="noopener noreferrer" className={styles.actionIcon} title="PDF">
                          <FileText size={18} />
                        </a>
                      )}
                      {paper.links?.code && (
                        <a href={paper.links.code} target="_blank" rel="noopener noreferrer" className={styles.actionIcon} title="Code">
                          <GitHub size={18} />
                        </a>
                      )}
                      {paper.links?.demo && (
                        <a href={paper.links.demo} target="_blank" rel="noopener noreferrer" className={styles.actionIcon} title="Demo">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              No papers found.
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}