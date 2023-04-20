import Button from '@mui/material/Button'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import './index.scss'

const FullScreen = () => {
  const { t } = useTranslation()
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement)

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
      return
    }

    document.exitFullscreen()
    setIsFullScreen(false)
  }

  return (
    <Button onClick={toggleFullScreen} className="full-screen-toggle" variant={isFullScreen ? 'contained' : 'outlined'}>
      <span>{isFullScreen ? t('Leave From Fullscreen') : t('Switch to Fullscreen')}</span>
    </Button>
  )
}
export default FullScreen
