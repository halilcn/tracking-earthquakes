import { useMemo } from 'react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import constantsTestid from '../../../../../constants/testid'
import useEarthquakeAnimation from '../../../../../hooks/useEarthquakeAnimation'
import { earthquakeActions } from '../../../../../store/earthquake'
import dayjs from '../../../../../utils/dayjs'
import './index.scss'

const TrackTime = () => {
  const testid = constantsTestid.trackTime
  const dispatch = useDispatch()
  const animation = useSelector(state => state.earthquake.animation)
  const { handleSetAnimateEarthquake } = useEarthquakeAnimation()

  const totalAnimateMinutes = useMemo(() => {
    return dayjs(animation.filters.endDate).diff(dayjs(animation.filters.startDate), 'minutes')
  }, [animation.filters.endDate, animation.filters.startDate])
  const currentCompletedMinutes = dayjs(animation.currentDate).diff(dayjs(animation.filters.startDate), 'minutes')
  const completedPercentageOfTime = ((currentCompletedMinutes * 100) / totalAnimateMinutes).toFixed(2)

  const handleChangeRangeInput = e => {
    const newCurrentDate = dayjs(animation.filters.startDate).add(e.target.value, 'minutes').format()
    dispatch(earthquakeActions.setAnimationCurrentDate(newCurrentDate))
    handleSetAnimateEarthquake({ currentDate: newCurrentDate })
  }

  return (
    <div data-testid={testid.container} className="track-time">
      <div className="track-time__current-date">{dayjs(animation.currentDate).format('DD MMM HH:mm (UTCZ)')}</div>
      <div className="track-time__range">
        <input
          data-testid={testid.rangeInput}
          min={0}
          max={totalAnimateMinutes}
          value={currentCompletedMinutes}
          step={animation.filters.range}
          onChange={handleChangeRangeInput}
          disabled={animation.isActive}
          style={{
            background: `linear-gradient(90deg, #308fe8 ${completedPercentageOfTime}%, #d3eaff ${completedPercentageOfTime}%)`,
            cursor: animation.isActive && 'default',
          }}
          className="track-time__completed-percentage"
          type="range"
        />
      </div>
      <div className="track-time__dates">
        <div className="track-time__date">{dayjs(animation.filters.startDate).format('DD MMM')}</div>
        <div className="track-time__date">{dayjs(animation.filters.endDate).format('DD MMM')}</div>
      </div>
    </div>
  )
}

export default TrackTime
