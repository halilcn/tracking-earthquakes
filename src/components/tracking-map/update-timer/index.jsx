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
      <div className="update-timer__content">
        {time} saniye sonra güncellenecek
        <div className="update-timer__bg-filter" />
      </div>
    </div>
  )
}

export default UpdateTimer
