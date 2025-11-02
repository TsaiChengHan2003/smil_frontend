import { useTranslation } from "react-i18next"
import { Compass, Mail, Phone, Printer, GitHub } from "react-feather"
import { toast } from "react-toastify"

export function Footer() {
  const { t } = useTranslation()
  const footer = t('footer', { returnObjects: true }) // 取得物件
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`已複製：${text}`)
    })
  }

  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="row">
          <div className="d-flex flex-column gap-2" style={{ width: '100%' }}>
            <div className="d-flex gap-2 justify-content-center align-items-center">
              <span onClick={() => handleCopy(footer.address)} title="點擊複製地址">
                <Compass size={16} />
              </span>
              <span onClick={() => handleCopy(footer.email)} title="點擊複製電子郵件">
                <Mail size={16} />
              </span>
              <span onClick={() => handleCopy(footer.phone)} title="點擊複製電話">
                <Phone size={16} />
              </span>
              <span onClick={() => handleCopy(footer.fax)} title="點擊複製傳真">
                <Printer size={16} />
              </span>
              <span onClick={() => handleLinkClick(footer.github)} title="點擊開啟 GitHub">
                <GitHub size={16} />
              </span>
            </div>
            <span className="d-flex mt-1 justify-content-center">&copy; {footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}