import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { MAP_UPDATE_MIN } from '../../../constants'
import { isSelectedAnyArchiveItem } from '../../../store/earthquake'

import './index.scss'

const UpdateTimer = () => {
  const selectedArchive = useSelector(isSelectedAnyArchiveItem)

  const [time, setTime] = useState(MAP_UPDATE_MIN)
  const timeInterval = useRef(null)

  const createTimeInterval = () => {
    if (timeInterval.current) return
    timeInterval.current = setInterval(() => {
      setTime(time => (time === 0 ? MAP_UPDATE_MIN : time - 1))
    }, 1000)
  }

  const removeTimeInterval = () => {
    clearInterval(timeInterval.current)
    timeInterval.current = null
    setTime(MAP_UPDATE_MIN)
  }

  useEffect(() => {
    createTimeInterval()
    return removeTimeInterval
  }, [])

  useEffect(() => {
    if (selectedArchive) {
      removeTimeInterval()
      return
    }
    createTimeInterval()
    return removeTimeInterval
  }, [selectedArchive])

  return (
    <>
      {!selectedArchive && (
        <div className="update-timer">
          <div className="update-timer__content">
            {time} saniye sonra güncellenecek
            <div className="update-timer__bg-filter" />
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateTimer
