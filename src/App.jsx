import * as Sentry from '@sentry/react'
import 'intro.js/introjs.css'
import { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'

import AppContainer from './components/app-container'
import ErrorBoundary from './components/error-boundary'
import GeneralErrorPage from './components/general-error-page'
import './i18n'
import './styles/default.scss'

ReactGA.initialize(process.env.VITE_TRACKING_ID)
if (process.env.ENVIRONMENT === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [],
  })
}

const App = () => {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = t('Track Earthquakes')
  }, [])

  return <AppContainer />
}

const withErrorBoundary = WrapperComponent => () => {
  return (
    <ErrorBoundary ErrorFallbackComponent={GeneralErrorPage}>
      <WrapperComponent />
    </ErrorBoundary>
  )
}

export default withErrorBoundary(App)
