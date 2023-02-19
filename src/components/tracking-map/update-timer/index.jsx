import Alert from '@mui/material/Alert'
import { useEffect, useState } from 'react'
import { MAP_UPDATE_MIN } from '../../../constants'

import './index.scss'

const UpdateTimer = () => {
  const [time, setTime] = useState(MAP_UPDATE_MIN)

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(time => (time === 0 ? MAP_UPDATE_MIN : time - 1))
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  return (
    <div className="update-timer">
      <Alert className="update-timer__content" icon={false} severity="success">
        {time} saniye sonra harita güncellenecek
      </Alert>
    </div>
  )
}

export default UpdateTimer
