import Fragment from "@/components/common/Fragment";
import { useMemo, useEffect, useRef, useState } from "react";
import { Mail, GitHub } from "react-feather";
import { SiGooglescholar } from "react-icons/si";
import { memberJson } from "@/datas/member";
import styles from "@/assets/styles/components/member.module.scss";
import Tags from "@/components/tags";
import { useTranslation } from "react-i18next";

// 教授卡片組件（特殊樣式，佔整列）
const ProfessorCard = ({ professor, isVisible }) => {
  const hasPapers = professor.papers_url;
  const emailAddress = professor.email_url?.replace("mailto:", "") || "";
  
  // 處理 Email：確保使用 mailto: 連結
  const getMailtoLink = (email) => {
    if (!email) return "";
    // 如果已經有 mailto:，直接返回；否則加上 mailto:
    return email.startsWith("mailto:") ? email : `mailto:${email}`;
  };

  return (
    <div className={`${styles.professorCard} ${isVisible ? styles.cardVisible : ""}`}>
      <div className={styles.professorContent}>
        <div className={styles.professorAvatarWrapper}>
          <img 
            src={professor.image_url} 
            alt={professor.name}
            className={styles.professorAvatar}
            onError={(e) => {
              e.target.src = "https://secure.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y";
            }}
          />
        </div>
        
        <div className={styles.professorInfo}>
          <div className={styles.professorHeader}>
            <h2 className={styles.professorName}>{professor.name}</h2>
            <span className={styles.professorTitle}>指導教授</span>
          </div>
          
          {professor.content && (
            <p className={styles.professorDescription}>{professor.content}</p>
          )}
          
          <div className={styles.professorContact}>
            {emailAddress && (
              <div className={styles.contactItem}>
                <Mail size={20} />
                <a 
                  href={getMailtoLink(emailAddress)} 
                  className={styles.contactLink}
                >
                  {emailAddress}
                </a>
              </div>
            )}
            
            {hasPapers && (
              <div className={styles.contactItem}>
                <SiGooglescholar size={20} />
                <a 
                  href={professor.papers_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  Papers
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 成員卡片組件
const MemberCard = ({ member, isVisible }) => {
  const emailAddress = member.email_url?.replace("mailto:", "") || "";
  const hasEmail = emailAddress.trim() !== "";
  const hasGit = member.git_url && member.git_url.trim() !== "";
  const hasScholar = member.papers_url && member.papers_url.trim() !== "";

  // 處理 Email：確保使用 mailto: 連結
  const getMailtoLink = (email) => {
    if (!email) return "#";
    return email.startsWith("mailto:") ? email : `mailto:${email}`;
  };

  return (
    <div className={`${styles.memberCard} ${isVisible ? styles.cardVisible : ""}`}>
      <div className={styles.avatarWrapper}>
        <img 
          src={member.image_url} 
          alt={member.name}
          className={styles.avatar}
          onError={(e) => {
            e.target.src = "https://secure.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y";
          }}
        />
      </div>
      
      <div className={styles.memberInfo}>
        <h3 className={styles.memberName}>{member.name}</h3>
        
        <p className={styles.memberContent}>{member.content}</p>
        <div className={styles.memberFooter}>
          <div className={styles.tagsWrapper}>
            <Tags tags={member.tags} />
          </div>
          
          <div className={styles.iconsWrapper}>
            {hasEmail ? (
              <a
                href={getMailtoLink(emailAddress)}
                className={styles.iconLink}
                aria-label="Email"
                title={emailAddress}
              >
                <Mail size={18} />
              </a>
            ) : (
              <span className={`${styles.iconLink} ${styles.iconDisabled}`} aria-label="Email">
                <Mail size={18} />
              </span>
            )}
            
            <a
              href={member.git_url || "#"}
              className={`${styles.iconLink} ${!hasGit ? styles.iconDisabled : ""}`}
              onClick={(e) => !hasGit && e.preventDefault()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHub size={18} />
            </a>
            
            <a
              href={member.papers_url || "#"}
              className={`${styles.iconLink} ${!hasScholar ? styles.iconDisabled : ""}`}
              onClick={(e) => !hasScholar && e.preventDefault()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Scholar"
            >
              <SiGooglescholar size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Member() {
  const { t } = useTranslation();
  const members = t("members", { returnObjects: true });
  const sortedMembers = useMemo(() => {
    if (!memberJson || !Array.isArray(memberJson)) return [];
    
    const typeOrder = [0, 1, 2, 3, 4]; // 排序順序
    
    return [...memberJson].sort((a, b) => {
      const aIndex = typeOrder.indexOf(a.type);
      const bIndex = typeOrder.indexOf(b.type);
      // 如果找不到 type，放到最後
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, []);

  // 分離教授和其他成員（教授只取第一筆）
  const { professor, groupedMembers } = useMemo(() => {
    // 只取第一筆 type 0 的資料作為教授
    const professor = sortedMembers.find(member => member.type === 0) || null;
    
    const groups = {
      1: { title: members.doctor, members: [], typeKey: 1 },
      2: { title: members.master, members: [], typeKey: 2 },
    }

    sortedMembers.forEach(member => {
      if (member && member.type !== 0 && groups[member.type] !== undefined) {
        groups[member.type].members.push(member);
      }
    });

    const groupedMembers = [
      groups[1],
      groups[2],
    ].filter(group => group.members.length > 0);

    return { professor, groupedMembers };
  }, [sortedMembers, members]);

  // 滾動動畫觀察者
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef({});
  const observerRef = useRef(null);

  useEffect(() => {
    // 清理舊的觀察者
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 創建新的觀察者
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.dataset.cardId;
            if (cardId) {
              setVisibleCards((prev) => new Set([...prev, cardId]));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    // 觀察所有卡片
    Object.values(cardRefs.current).forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [groupedMembers]);

  // 教授卡片的觀察者
  const professorRef = useRef(null);
  const [professorVisible, setProfessorVisible] = useState(false);

  useEffect(() => {
    if (professorRef.current && professor) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setProfessorVisible(true);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px"
        }
      );
      
      observer.observe(professorRef.current);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [professor]);

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{members.title}</h1>
        
        {/* 教授區塊 - 獨立顯示 */}
        {professor && (
          <section 
            className={`${styles.section} ${styles.professorSection}`}
            ref={professorRef}
            data-section-index={0}
          >
            <ProfessorCard 
              professor={professor} 
              isVisible={professorVisible}
            />
          </section>
        )}
        
        {/* 其他成員區塊 */}
        {groupedMembers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>{members.noData}</p>
            <p style={{ fontSize: "0.9rem", color: "#97949b", marginTop: "1rem" }}>
              資料數量: {memberJson?.length || 0}
            </p>
          </div>
        ) : (
          groupedMembers.map((group, groupIndex) => (
            <section 
              key={groupIndex} 
              className={`${styles.section} ${styles.sectionScroll}`}
              data-section-index={groupIndex + 1}
            >
              <h2 className={styles.sectionTitle}>{group.title}</h2>
              <div className={styles.membersGrid}>
                {group.members.map((member, index) => {
                  const cardId = `${group.typeKey}-${member.name}-${index}`;
                  return (
                    <div
                      key={cardId}
                      ref={(el) => {
                        if (el) cardRefs.current[cardId] = el;
                      }}
                      data-card-id={cardId}
                    >
                      <MemberCard 
                        member={member} 
                        isVisible={visibleCards.has(cardId)}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </Fragment>
  );
}