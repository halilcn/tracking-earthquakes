import { useDispatch, useSelector } from 'react-redux'
import dayjs from '../../../../../utils/dayjs'
import { useMemo } from 'react'
import { earthquakeActions } from '../../../../../store/earthquake'

import './index.scss'

const TrackTime = props => {
  const dispatch = useDispatch()
  const animation = useSelector(state => state.earthquake.animation)

  const { allEarthquakes } = props

  const totalAnimateMinutes = useMemo(() => {
    return dayjs(animation.filters.endDate).diff(dayjs(animation.filters.startDate), 'minutes')
  }, [animation.filters.endDate, animation.filters.startDate])
  const currentCompletedMinutes = totalAnimateMinutes - dayjs(animation.filters.endDate).diff(dayjs(animation.currentDate), 'minutes')
  const completedPercentageOfTime = ((currentCompletedMinutes * 100) / totalAnimateMinutes).toFixed(2)

  const handleChangeRangeInput = e => {
    const newCurrentDate = dayjs(animation.filters.startDate).add(e.target.value, 'minutes').format()
    dispatch(earthquakeActions.setAnimationCurrentDate(newCurrentDate))
    testHandle(newCurrentDate)
  }

  const testHandle = currentDate => {
    let nextAnimationCurrentDate = dayjs(currentDate).add(animation.filters.range, 'minutes')
    const filteredEarthquakes = allEarthquakes.filter(item => {
      const isBeforeFromNextCurrentDate = dayjs(item.properties.date).isBefore(nextAnimationCurrentDate)
      const isAfterFromCurrentDate = dayjs(dayjs(currentDate)).isBefore(dayjs(item.properties.date))
      return isBeforeFromNextCurrentDate && isAfterFromCurrentDate
    })

    dispatch(earthquakeActions.setEarthquakes(filteredEarthquakes))
    dispatch(earthquakeActions.setAnimationCurrentDate(nextAnimationCurrentDate.format()))
  }

  console.log('currentCompletedMinutes', currentCompletedMinutes)

  return (
    <div className="track-time">
      <div className="track-time__range">
        <input
          min={0}
          max={totalAnimateMinutes}
          value={currentCompletedMinutes}
          step={animation.filters.range}
          onChange={handleChangeRangeInput}
          disabled={animation.isActive}
          style={{ background: `linear-gradient(90deg, #308fe8 ${completedPercentageOfTime}%, #d3eaff ${completedPercentageOfTime}%)` }}
          className="track-time__completed-percentage"
          type="range"
        />
        <div className="track-time__current-date">12-12-2022</div>
      </div>
      <div className="track-time__dates">
        <div className="track-time__date">{dayjs(animation.filters.startDate).format('DD MMM')}</div>
        <div className="track-time__date">{dayjs(animation.filters.endDate).format('DD MMM')}</div>
      </div>
    </div>
  )
}

/**
    <div style={{ width: `${completedPercentageOfTime}%` }} className="track-time__completed-percentage" />
 */

export default TrackTime
