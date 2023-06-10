import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { getLanguage } from '../utils/localStorageActions'
import * as resources from './languages'

i18n.use(initReactI18next).init({
  lng: getLanguage() || navigator.language || navigator.userLanguage || 'en',
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
