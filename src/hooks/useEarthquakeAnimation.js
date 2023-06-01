import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { earthquakeActions } from '../store/earthquake'
import dayjs from '../utils/dayjs'

const useEarthquakeAnimation = () => {
  const dispatch = useDispatch()
  const animation = useSelector(state => state.earthquake.animation)

  const handleSetAnimateEarthquake = useCallback(
    ({ currentDate, earthquakes }) => {
      let nextAnimationCurrentDate = dayjs(currentDate).add(animation.filters.range, 'minutes')
      const checkDate = dayjs(nextAnimationCurrentDate).isAfter(dayjs(animation.filters.endDate))
      if (checkDate) nextAnimationCurrentDate = dayjs(animation.filters.endDate)

      const allEarthquakes = earthquakes ?? animation.allEarthquakes
      const filteredEarthquakes = allEarthquakes.filter(item => {
        const isBeforeFromNextCurrentDate = dayjs(item.properties.date).isBefore(nextAnimationCurrentDate)
        const isAfterFromCurrentDate = dayjs(dayjs(currentDate)).isBefore(dayjs(item.properties.date))
        return isBeforeFromNextCurrentDate && isAfterFromCurrentDate
      })

      dispatch(earthquakeActions.setEarthquakes(filteredEarthquakes))
      dispatch(earthquakeActions.setAnimationCurrentDate(nextAnimationCurrentDate.format()))
    },
    [animation.allEarthquakes, animation.filters.range]
  )

  return { handleSetAnimateEarthquake }
}

export default useEarthquakeAnimation
