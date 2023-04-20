import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLanguage } from '../utils/localStorageActions'
import en from './languages/en'
import tr from './languages/tr'

i18n.use(initReactI18next).init({
  lng: getLanguage() || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en,
    tr,
  },
})

export default i18n
