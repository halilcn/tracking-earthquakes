import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import constantsTestid from '../../../../../constants/testid.js'
import './index.scss'

const FullScreen = () => {
  const testid = constantsTestid.fullScreen
  const { t } = useTranslation()
  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement)

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
      return
    }

    document.exitFullscreen()
    setIsFullScreen(false)
  }

  const handleFullScreenExit = () => {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      setIsFullScreen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenExit)
    document.addEventListener('webkitfullscreenchange', handleFullScreenExit)
    document.addEventListener('mozfullscreenchange', handleFullScreenExit)
    document.addEventListener('MSFullscreenChange', handleFullScreenExit)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenExit)
      document.removeEventListener('webkitfullscreenchange', handleFullScreenExit)
      document.removeEventListener('mozfullscreenchange', handleFullScreenExit)
      document.removeEventListener('MSFullscreenChange', handleFullScreenExit)
    }
  }, [])

  return (
    <Button
      data-testid={testid.fullScreenButton}
      onClick={toggleFullScreen}
      className="full-screen-toggle"
      variant={isFullScreen ? 'contained' : 'outlined'}>
      <div>{isFullScreen ? t('Leave From Fullscreen') : t('Switch to Fullscreen')}</div>
    </Button>
  )
}
export default FullScreen
