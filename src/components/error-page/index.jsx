import Alert from '@mui/material/Alert'
import React from 'react'
import { useTranslation } from 'react-i18next'

import constantsTestid from '../../constants/testid'
import './index.scss'

const ErrorPage = () => {
  const testid = constantsTestid.errorPage
  const { t } = useTranslation()

  return (
    <div data-testid={testid.errorPageContainer} className="error-page">
      <Alert severity="error">{t('Occurred a problem while loading the page')} :/</Alert>
    </div>
  )
}

export default ErrorPage
