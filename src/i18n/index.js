import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as resources from './languages'
import { getCurrentLanguage } from '../utils'

i18n.use(initReactI18next).init({
  lng: getCurrentLanguage() || 'en',
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
