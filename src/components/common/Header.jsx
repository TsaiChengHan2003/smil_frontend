import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Globe, Menu, X } from 'react-feather' // 新增 Menu, X
import { GoPerson } from "react-icons/go"
import { useGoogleAuth } from '@/contexts/GoogleAuthContext'
import { GoogleLoginPopup } from '@/components/popup/GoogleLoginPopup'
import { UserDropdown } from './UserDropdown'

export function Header() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn, handleLogout } = useGoogleAuth()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [headerOpacity, setHeaderOpacity] = useState(1)
  
  // RWD: 控制選單開關
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // 監聽路由變化，換頁時自動關閉選單
  const location = useLocation()
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const lang = (i18n.resolvedLanguage || i18n.language || 'zh')
  const currentLang = lang.startsWith('zh') ? 'zh' : 'en'
  const nextLang = currentLang === 'zh' ? 'en' : 'zh'

  const header = t('header', { returnObjects: true })

  const handleLogin = () => {
    setShowLoginPopup(true)
    setIsMenuOpen(false) // 點登入也關閉選單
  }

  // 控制選單開關
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset
      const opacity = Math.max(0.6, 1 - y / 400)
      setHeaderOpacity(opacity)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    // 如果選單打開，強制不透明，不然背景會透出原本頁面內容很亂
    <header className={`app-header ${isMenuOpen ? 'menu-open' : ''}`} style={{ '--header-opacity': isMenuOpen ? 1 : headerOpacity }}>
      <div className="container d-flex align-items-center justify-content-between py-2">
        <Link to="/" className="brand d-flex align-items-center text-decoration-none">
          <img src="/images/smil_logo.png" alt="SMIL" width="140" height="50" />
        </Link>

        {/* 漢堡按鈕 (只在手機版顯示，CSS控制) */}
        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </button>

        {/* 導航選單區塊 */}
        <nav className={`menu ${isMenuOpen ? 'is-active' : ''}`} aria-label="Main Navigation">
          <ul className="list-unstyled d-flex gap-2 m-0 nav-list">
            {Array.isArray(header) && header.map((item) => (
              item.authRequired && !isLoggedIn ? null : (
                <li key={item.title} className="menu-item">
                  <NavLink to={item.url || '#'} className="menu-link text-decoration-none" end>
                    {item.title}
                  </NavLink>
                </li>
              )
            ))}
            
            {/* 分隔線 (手機版可選) */}
            <li className="menu-divider d-lg-none"></li>

            <li className="menu-item">
              <div className="lang-toggle-wrapper">
                <button
                  type="button"
                  className="menu-link lang-toggle"
                  onClick={() => i18n.changeLanguage(nextLang)}
                >
                  <span className="icon" aria-hidden="true">
                    <Globe size={18} />
                  </span>
                  <span className="lang-label">{currentLang === 'zh' ? '中文' : 'English'}</span>
                  <span className="toggle-switch">
                    <span className={`toggle-slider ${currentLang}`}></span>
                  </span>
                </button>
              </div>
            </li>
            <li className="menu-item">
              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                <button 
                  type="button"
                  className="menu-link login-btn" 
                  onClick={handleLogin}
                >
                  <GoPerson size={18} />
                  <span className="btn-text">{t('login')}</span>
                </button>
              )}
            </li>
          </ul>
        </nav>

        {/* 遮罩 (點擊背景關閉選單) */}
        <div className={`menu-overlay ${isMenuOpen ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      </div>
      
      <GoogleLoginPopup 
        show={showLoginPopup} 
        onHide={() => setShowLoginPopup(false)} 
      />
    </header>
  )
}