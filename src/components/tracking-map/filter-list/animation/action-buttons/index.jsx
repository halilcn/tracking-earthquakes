import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from '../../../../../utils/dayjs'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../../../../../utils'
import { getAllEarthquakesByUsingKandilliAPI } from '../../../../../service/earthquakes'
import { getEarthquakesInWorld } from '../../../../../api'
import { earthquakeActions } from '../../../../../store/earthquake'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import './index.scss'

const ActionButtons = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { animation, isLoadingData } = useSelector(state => state.earthquake)
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

  const handleAllEarthquakes = async () => {
    try {
      dispatch(earthquakeActions.setEarthquakes([]))
      dispatch(earthquakeActions.setIsLoadingData(true))

      const allEarthquakes = await Promise.all([handleEarthquakesInTurkey(), handleEarthquakesInWorld()]).then(result => result.flat())
      dispatch(earthquakeActions.setAnimationAllEarthquakes(allEarthquakes))
      handleAnimationActive(true)
      return allEarthquakes
    } catch (err) {
      alert(t('Occurred a problem'))
    } finally {
      dispatch(earthquakeActions.setIsLoadingData(false))
    }
  }

  const handleStartAnimation = async () => {
    const allEarthquakes = await handleAllEarthquakes()
    let currentDate = animation.filters.startDate

    dispatch(earthquakeActions.setAnimationCurrentDate(currentDate))
    triggerAnimationLoop(currentDate, allEarthquakes)
  }

  const handleStopAnimation = () => {
    clearInterval(animationLoop.current)
    handleAnimationActive(false)
  }

  const triggerAnimationLoop = (date, earthquakes) => {
    let currentDate = date
    animationLoop.current = setInterval(() => {
      let nextAnimationCurrentDate = dayjs(currentDate).add(animation.filters.range, 'minutes')
      const checkDate = dayjs(nextAnimationCurrentDate).isAfter(dayjs(animation.filters.endDate))
      if (checkDate) nextAnimationCurrentDate = dayjs(animation.filters.endDate)

      const filteredEarthquakes = earthquakes.filter(item => {
        const isBeforeFromNextCurrentDate = dayjs(item.properties.date).isBefore(nextAnimationCurrentDate)
        const isAfterFromCurrentDate = dayjs(dayjs(currentDate)).isBefore(dayjs(item.properties.date))
        return isBeforeFromNextCurrentDate && isAfterFromCurrentDate
      })

      dispatch(earthquakeActions.setEarthquakes(filteredEarthquakes))
      dispatch(earthquakeActions.setAnimationCurrentDate(nextAnimationCurrentDate.format()))

      if (checkDate) {
        // TODO: ?
        handleStopAnimation()
        return
      }
      currentDate = nextAnimationCurrentDate.format()
    }, 1000)
  }

  const handleContinue = () => {
    triggerAnimationLoop(animation.currentDate, animation.allEarthquakes)
    handleAnimationActive(true)
  }

  const handleClear = () => {
    dispatch(earthquakeActions.setAnimationCurrentDate(null))
    handleAnimationActive(false)
    dispatch(earthquakeActions.setAnimationAllEarthquakes([]))
  }

  return (
    <div className="animation-actions">
      {!animation.currentDate && !animation.isActive && (
        <Button fullWidth disabled={isLoadingData} variant="contained" onClick={handleStartAnimation}>
          {t('start')}
        </Button>
      )}
      {animation.currentDate && animation.isActive && (
        <Button fullWidth color="error" variant="contained" onClick={handleStopAnimation}>
          {t('stop')}
        </Button>
      )}
      {animation.currentDate && !animation.isActive && (
        <div className="animation-actions__decide-buttons">
          <Button fullWidth color="error" variant="contained" onClick={handleClear}>
            {t('clear')}
          </Button>
          <Button fullWidth color="info" variant="contained" onClick={handleContinue}>
            {t('continue')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ActionButtons
