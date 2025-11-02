import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { Globe } from 'react-feather'
import { GoPerson } from "react-icons/go";

export function Header() {
  const { t, i18n } = useTranslation()

  const lang = (i18n.resolvedLanguage || i18n.language || 'zh')
  const currentLang = lang.startsWith('zh') ? 'zh' : 'en'
  const nextLang = currentLang === 'zh' ? 'en' : 'zh'

  const header = t('header', { returnObjects: true }) // 取得陣列

  const handleLogin = () => {
    console.log('login')
  } 

  const handleLogout = () => {
    console.log('logout')
  }

  return (
    <header className="app-header">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <Link to="/" className="brand d-flex align-items-center text-decoration-none">
          <img src="/images/smil_logo.png" alt="SMIL" width="140" height="50" />
        </Link>

        <nav className="menu" aria-label="Main Navigation">
          <ul className="list-unstyled d-flex gap-2 m-0">
            {Array.isArray(header) && header.map((item) => (
              <li key={item.title} className="menu-item">
                {item.url ? (
                  <NavLink to={item.url} className="menu-link text-decoration-none" end>
                    {item.title}
                  </NavLink>
                ) : (
                  <NavLink to={item.url} className="menu-link text-decoration-none" end>{item.title}</NavLink>
                )}
              </li>
            ))}
            <li className="menu-item">
              <div className="lang-toggle-wrapper">
                <button
                  type="button"
                  className="menu-link lang-toggle"
                  onClick={() => i18n.changeLanguage(nextLang)}
                  aria-label={`Switch language to ${nextLang.toUpperCase()}`}
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
              <button 
                type="button"
                className="menu-link login-btn" 
                onClick={() => handleLogin()}
                aria-label={t('login')}
              >
                <GoPerson size={18} />
                <span className="btn-text">{t('login')}</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}