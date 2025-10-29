import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { Globe } from 'react-feather'

export function Header() {
  const { t, i18n } = useTranslation()

  const lang = (i18n.resolvedLanguage || i18n.language || 'zh')
  const currentLang = lang.startsWith('zh') ? 'zh' : 'en'
  const nextLang = currentLang === 'zh' ? 'en' : 'zh'

  const header = t('header', { returnObjects: true }) // 取得陣列

  return (
    <header className="app-header">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <Link to="/" className="brand d-flex align-items-center gap-2 text-decoration-none">
          <img src="/vite.svg" alt="SMIL" width="28" height="28" />
          <span className="fw-bold">SMIL</span>
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
                <button
                  type="button"
                  className="menu-link lang-toggle"
                  onClick={() => i18n.changeLanguage(nextLang)}
                  aria-label={`Switch language to ${nextLang.toUpperCase()}`}
                >
                <span className="icon" aria-hidden="true">
                  <Globe size={18} />
                </span>
                <span className={currentLang === 'zh' ? 'active' : ''}>ZH</span>
                <span className="sep">/</span>
                <span className={currentLang === 'en' ? 'active' : ''}>EN</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}