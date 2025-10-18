import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import zh from './locales/zh.json'

i18n
  .use(LanguageDetector) // 自動偵測瀏覽器語言
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: 'zh', // 偵測不到時預設中文
    interpolation: { escapeValue: false },
  })

export default i18n
