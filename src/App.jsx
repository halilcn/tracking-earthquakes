import 'intro.js/introjs.css'
import { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'

import AppContainer from './components/app-container'
import './i18n'
import './styles/default.scss'

ReactGA.initialize(process.env.VITE_TRACKING_ID)

const App = () => {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = t('Tracking Earthquakes')
  }, [])

  return <AppContainer />
}

export default App
