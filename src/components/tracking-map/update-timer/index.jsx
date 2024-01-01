import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GrUpdate } from 'react-icons/gr'
import { MdUpdate } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

import { MAP_TIMER_ACTION, MAP_TIMER_STATUS, MAP_UPDATE_MIN } from '../../../constants'
import constantsTestid from '../../../constants/testid'
import { earthquakeActions } from '../../../store/earthquake'
import dayjs from '../../../utils/dayjs'
import './index.scss'

const UpdateTimer = () => {
  const testid = constantsTestid.updateTimer

  const [time, setTime] = useState(MAP_UPDATE_MIN)

  const { archiveDate, isLoadingData, mapTimerAction, mapTimerStatus } = useSelector(state => {
    const { archiveDate, isLoadingData, mapTimerAction, mapTimerStatus } = state.earthquake

    return { archiveDate, isLoadingData, mapTimerAction, mapTimerStatus }
  })

  const isEnabledToForceUpdate = mapTimerStatus === MAP_TIMER_STATUS.TIMER && !isLoadingData

  const timeInterval = useRef(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const createTimeInterval = () => {
    if (timeInterval.current) return
    timeInterval.current = setInterval(() => {
      setTime(time => (time === 1 ? MAP_UPDATE_MIN : time - 1))
    }, 1000)
  }

  const removeTimeInterval = () => {
    if (!timeInterval.current) return

    clearInterval(timeInterval.current)
    timeInterval.current = null
    setTime(MAP_UPDATE_MIN)
  }

  const getArchiveDateText = () => {
    const archiveDateFormat = 'MMM D YYYY'

    switch (true) {
      case !!archiveDate.certainDate:
        return `${dayjs().add(-archiveDate.certainDate, 'day').format(archiveDateFormat)} / ${dayjs().format(archiveDateFormat)}`
      case !!(archiveDate.startDate && archiveDate.endDate):
        return `${dayjs(archiveDate.startDate).format(archiveDateFormat)} / ${dayjs(archiveDate.endDate).format(archiveDateFormat)}`
    }
  }

  useEffect(() => {
    switch (mapTimerAction) {
      case MAP_TIMER_ACTION.START:
        createTimeInterval()
        return
      case MAP_TIMER_ACTION.CLEAR:
        removeTimeInterval()
        return
    }

    dispatch(earthquakeActions.updateMapTimerStatus(MAP_TIMER_ACTION.NONE_ACTION))
  }, [mapTimerAction])

  useEffect(() => {
    return () => {
      removeTimeInterval()
    }
  }, [])

  const memoizedTimerStatusContent = useMemo(() => {
    const updateTimerTypeClass = classNames('update-timer__timer-type', { 'update-timer__timer-type--disabled': !isEnabledToForceUpdate })

    return (
      <div className={updateTimerTypeClass}>
        <GrUpdate className="update-timer__icon" />
        <div className="update-timer__timer-minutes">{time}</div>
        <div>{t('minutes')}</div>
        <div className="update-timer__bg-filter" />
      </div>
    )
  }, [time, isEnabledToForceUpdate])

  const memoizedArchiveStatusContent = useMemo(
    () => (
      <div className="update-timer__archive-type">
        <MdUpdate size={18} className="update-timer__icon" />
        <span>{getArchiveDateText()}</span>
        <div className="update-timer__bg-filter" />
      </div>
    ),
    [archiveDate]
  )

  const getContent = () => {
    switch (mapTimerStatus) {
      case MAP_TIMER_STATUS.ARCHIVE:
        return memoizedArchiveStatusContent
      case MAP_TIMER_STATUS.TIMER:
        return memoizedTimerStatusContent
      default:
        return ''
    }
  }

  const handleForceGetEarthquakes = () => {
    dispatch(earthquakeActions.updateForceUpdate(true))
  }

  return (
    <div data-testid={testid.timerContainer} className="update-timer">
      <div className="update-timer__content" {...(isEnabledToForceUpdate ? { onClick: handleForceGetEarthquakes } : {})}>
        {getContent()}
      </div>
    </div>
  )
}

export default UpdateTimer
