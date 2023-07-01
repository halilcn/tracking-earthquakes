import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GrUpdate } from 'react-icons/gr'
import { useSelector } from 'react-redux'

import { MAP_UPDATE_MIN } from '../../../constants'
import constantsTestid from '../../../constants/testid'
import { isSelectedAnyArchiveItem } from '../../../store/earthquake'
import './index.scss'

const UpdateTimer = () => {
  const testid = constantsTestid.updateTimer
  const { t } = useTranslation()
  const selectedArchive = useSelector(isSelectedAnyArchiveItem)
  const isAnimationActive = useSelector(state => state.earthquake.animation.currentDate)

  const [time, setTime] = useState(MAP_UPDATE_MIN)
  const timeInterval = useRef(null)

  const isEnableTimer = !selectedArchive && !isAnimationActive

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

  const triggerFreshTime = status => {
    if (status) {
      removeTimeInterval()
      return
    }
    createTimeInterval()
    return removeTimeInterval
  }

  useEffect(() => {
    createTimeInterval()
    return removeTimeInterval
  }, [])

  useEffect(() => {
    return triggerFreshTime(selectedArchive)
  }, [selectedArchive])

  useEffect(() => {
    return triggerFreshTime(isAnimationActive)
  }, [isAnimationActive])

  return (
    <>
      {isEnableTimer && (
        <div data-testid={testid.timerContainer} className="update-timer">
          <div className="update-timer__content">
            <GrUpdate className="update-timer__icon" />{' '}
            <span>
              {time} {t('minutes')}
            </span>
            <div className="update-timer__bg-filter" />
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateTimer
