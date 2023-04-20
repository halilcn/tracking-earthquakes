import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'

import './index.scss'

const ErrorPage = () => {
  const { t } = useTranslation()

  return (
    <div className="error-page">
      <Alert severity="error">{t('Occurred a problem while getting the data on earthquakes')} :/</Alert>
    </div>
  )
}

export default ErrorPage
