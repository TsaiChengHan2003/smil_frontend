import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGoogleAuth } from '@/contexts/GoogleAuthContext';
import { User, LogOut, ChevronDown } from 'react-feather';
import styles from '@styles/components/userDropdown.module.scss';

export function UserDropdown() {
  const { t } = useTranslation();
  const { user, handleLogout, getUserProfile } = useGoogleAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const userProfile = getUserProfile();

  // 檢測是否為手機版
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEditProfile = () => {
    // TODO: 開啟編輯個人資訊的彈窗或頁面
    console.log('編輯個人資訊');
    setIsOpen(false);
  };

  // 手機版：直接展開顯示
  if (isMobile) {
    return (
      <div className={styles.userDropdownMobile} ref={dropdownRef}>
        <div className={styles.userInfoMobile}>
          <img
            src={userProfile.picture}
            alt={userProfile.name}
            className={styles.avatarMobile}
            onError={(e) => {
              e.target.src = '/images/default-avatar.png';
            }}
          />
          <div className={styles.userDetailsMobile}>
            <p className={styles.userNameMobile}>{userProfile.name}</p>
            <p className={styles.userEmailMobile}>{userProfile.email}</p>
          </div>
        </div>

        <div className={styles.dividerMobile}></div>

        <button
          className={styles.menuItemMobile}
          onClick={handleEditProfile}
        >
          <User size={18} />
          <span>編輯個人資訊</span>
        </button>

        <button
          className={styles.menuItemMobile}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>{t('logout')}</span>
        </button>
      </div>
    );
  }

  // 桌面版：下拉選單
  return (
    <div className={styles.userDropdown} ref={dropdownRef}>
      <button
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <img
          src={userProfile.picture}
          alt={userProfile.name}
          className={styles.avatar}
          onError={(e) => {
            e.target.src = '/images/default-avatar.png';
          }}
        />
        <span className={styles.userName}>{userProfile.name}</span>
        <ChevronDown size={16} className={styles.chevron} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.userInfo}>
            <img
              src={userProfile.picture}
              alt={userProfile.name}
              className={styles.avatarLarge}
              onError={(e) => {
                e.target.src = '/images/default-avatar.png';
              }}
            />
            <div className={styles.userDetails}>
              <p className={styles.userNameLarge}>{userProfile.name}</p>
              <p className={styles.userEmail}>{userProfile.email}</p>
            </div>
          </div>

          <div className={styles.divider}></div>

          <button
            className={styles.menuItem}
            onClick={handleEditProfile}
          >
            <User size={18} />
            <span>編輯個人資訊</span>
          </button>

          <button
            className={styles.menuItem}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>{t('logout')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

