import { Button } from '@mui/material'

import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from '../../../../../utils/dayjs'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../../../../../utils'
import { getAllEarthquakesByUsingKandilliAPI } from '../../../../../service/earthquakes'
import { getEarthquakesInWorld } from '../../../../../api'
import { earthquakeActions } from '../../../../../store/earthquake'
import { useRef, useState } from 'react'

const ActionButtons = props => {
  const [earthquakes, setEarthquakes] = useState([])

  const dispatch = useDispatch()
  const animation = useSelector(state => state.earthquake.animation)
  const animationLoop = useRef()

  const handleAnimationActive = status => dispatch(earthquakeActions.updateAnimationIsActive(status))

  // TODO: duplicate code?
  const handleEarthquakesInTurkey = async () => {
    const params = {
      date_end: convertDateFormatForAPI(dayjs(animation.filters.endDate)),
      date: convertDateFormatForAPI(dayjs(animation.filters.startDate)),
    }
    const earthquakes = await getAllEarthquakesByUsingKandilliAPI(params)
    const preparedEarthquakesData = earthquakes.map(earthquake => prepareEarthquakeKandilli(earthquake))
    return preparedEarthquakesData
  }

  const handleEarthquakesInWorld = async () => {
    const requestParams = {
      starttime: convertDateFormatForAPI(dayjs(animation.filters.startDate)),
      endtime: convertDateFormatForAPI(dayjs(animation.filters.endDate)),
    }
    const { features } = await getEarthquakesInWorld(requestParams)
    const preparedEarthquakesData = features.map(earthquake => prepareEarthquakeUsgs(earthquake))
    return preparedEarthquakesData
  }

  const handleStartAnimation = async () => {
    handleAnimationActive(true)
    const allEarthquakes = await Promise.all([handleEarthquakesInTurkey(), handleEarthquakesInWorld()]).then(result => result.flat())
    setEarthquakes(allEarthquakes)
    let currentDate = animation.currentDate
    if (!currentDate) {
      dispatch(earthquakeActions.setAnimationCurrentDate(animation.filters.startDate))
      currentDate = animation.filters.startDate
    }

    triggerAnimationLoop(currentDate, allEarthquakes)

    //dispatch(earthquakeActions.setEarthquakes(earthquakes))
    //const currentDate = dayjs(animation.filters.startDate).add(2, 'hours')
    //dispatch(earthquakeActions.setEarthquakes([earthquakes]))
  }

  const handleStopAnimation = () => {
    clearInterval(animationLoop.current)
    handleAnimationActive(false)
  }

  const triggerAnimationLoop = (date, earthquakes) => {
    let currentDate = date
    animationLoop.current = setInterval(() => {
      const nextAnimationCurrentDate = dayjs(currentDate).add(1, 'hour')
      const filteredEarthquakes = earthquakes.filter(item => {
        return (
          dayjs(item.properties.date).isBefore(nextAnimationCurrentDate) && dayjs(dayjs(currentDate)).isBefore(dayjs(item.properties.date))
        )
      })
      console.log('filteredEarthquakes', filteredEarthquakes)
      dispatch(earthquakeActions.setAnimationCurrentDate(nextAnimationCurrentDate.format()))
      currentDate = nextAnimationCurrentDate.format()
      dispatch(earthquakeActions.setEarthquakes(filteredEarthquakes))
    }, 1000)
  }

  const handleContinue = () => {
    triggerAnimationLoop(animation.currentDate, earthquakes)
    handleAnimationActive(true)
  }

  const handleClear = () => {
    dispatch(earthquakeActions.setAnimationCurrentDate(null))
    handleAnimationActive(false)
    setEarthquakes([])
  }

  return (
    <div className="animation-actions">
      {!animation.currentDate && !animation.isActive && (
        <Button fullWidth variant="contained" onClick={handleStartAnimation}>
          start
        </Button>
      )}
      {animation.currentDate && animation.isActive && (
        <Button fullWidth color="error" variant="contained" onClick={handleStopAnimation}>
          stop
        </Button>
      )}
      {animation.currentDate && !animation.isActive && (
        <div className="animation-actions__decide-buttons">
          <Button fullWidth color="error" variant="contained" onClick={handleClear}>
            clear
          </Button>
          <Button fullWidth color="info" variant="contained" onClick={handleContinue}>
            continue
          </Button>
        </div>
      )}
    </div>
  )
}

export default ActionButtons
