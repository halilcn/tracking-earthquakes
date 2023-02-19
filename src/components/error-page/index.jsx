import Alert from '@mui/material/Alert'

import './index.scss'

const ErrorPage = () => {
  return (
    <div className="error-page">
      <Alert severity="error">Deprem verileri çekilirken bir hata oluştu :/</Alert>
    </div>
  )
}

export default ErrorPage
