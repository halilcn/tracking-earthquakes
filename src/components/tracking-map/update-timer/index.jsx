import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GrUpdate } from 'react-icons/gr'
import { MdUpdate } from 'react-icons/md'
import { useSelector } from 'react-redux'

import { MAP_UPDATE_MIN } from '../../../constants'
import constantsTestid from '../../../constants/testid'
import { isSelectedAnyArchiveItem } from '../../../store/earthquake'
import dayjs from '../../../utils/dayjs'
import './index.scss'

const UpdateTimer = () => {
  const testid = constantsTestid.updateTimer
  const { t } = useTranslation()
  const selectedArchive = useSelector(isSelectedAnyArchiveItem)
  const { isAnimationActive, archiveDate } = useSelector(state => {
    const { animation, archiveDate } = state.earthquake

    return { archiveDate, isAnimationActive: !!animation.currentDate }
  })

  const [time, setTime] = useState(MAP_UPDATE_MIN)
  const timeInterval = useRef(null)

  const isEnableArchiveDate = selectedArchive
  const isEnableTimer = !isEnableArchiveDate && !isAnimationActive

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

  const getArchiveDate = () => {
    if (archiveDate.certainDate) {
      return `${dayjs().add(-archiveDate.certainDate, 'day').format('MMM D YYYY')} / ${dayjs().format('MMM D YYYY')}`
    }

    if (archiveDate.startDate && archiveDate.endDate) {
      return `${dayjs(archiveDate.startDate).format('MMM D YYYY')} / ${dayjs(archiveDate.endDate).format('MMM D YYYY')}`
    }
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
      {isEnableArchiveDate && (
        <div data-testid={testid.timerContainer} className="update-timer">
          <div className="update-timer__content">
            <MdUpdate size={18} className="update-timer__icon" />
            <span>{getArchiveDate()}</span>
            <div className="update-timer__bg-filter" />
          </div>
        </div>
      )}
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
