import Button from '@mui/material/Button'
import { useState } from 'react'

import './index.scss'

const FullScreen = () => {
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
      <span>{isFullScreen ? 'Tam Ekrandan Çık' : 'Tam Ekrana Geç'}</span>
    </Button>
  )
}
export default FullScreen
