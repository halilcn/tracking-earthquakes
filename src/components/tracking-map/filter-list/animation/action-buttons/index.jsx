import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import constantsTestid from '../../../../../constants/testid'
import useEarthquakeAnimation from '../../../../../hooks/useEarthquakeAnimation'
import { getAllEarthquakes } from '../../../../../service/earthquakes'
import { earthquakeActions } from '../../../../../store/earthquake'
import { convertDateFormatForAPI } from '../../../../../utils'
import dayjs from '../../../../../utils/dayjs'
import './index.scss'

const ActionButtons = () => {
  const testid = constantsTestid.actionButtons
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { animation, isLoadingData } = useSelector(state => state.earthquake)
  const { handleSetAnimateEarthquake } = useEarthquakeAnimation()

  const isCompletedAnimation = dayjs(animation.filters.endDate).isSame(dayjs(animation.currentDate))

  const handleAnimationActive = status => dispatch(earthquakeActions.updateAnimationIsActive(status))
  const handleSetEarthquakes = earthquakes => dispatch(earthquakeActions.setEarthquakes(earthquakes))
  const handleSetAnimationAllEarthquakes = allEarthquakes => dispatch(earthquakeActions.setAnimationAllEarthquakes(allEarthquakes))
  const handleSetIsLoadingData = status => dispatch(earthquakeActions.setIsLoadingData(status))
  const handleSetAnimationCurrentDate = date => dispatch(earthquakeActions.setAnimationCurrentDate(date))
  const handleSetAnimationLoopInterval = loopInterval => dispatch(earthquakeActions.setAnimationLoopInterval(loopInterval))

  const handleAllEarthquakes = async () => {
    try {
      handleSetIsLoadingData(true)

      const allEarthquakes = await getAllEarthquakes({
        startDate: convertDateFormatForAPI(dayjs(animation.filters.startDate)),
        endDate: convertDateFormatForAPI(dayjs(animation.filters.endDate)),
      })

      handleSetAnimationAllEarthquakes(allEarthquakes)
      return allEarthquakes
    } catch (err) {
      alert(t('Occurred a problem'))
      throw new Error('Handle earthquakes problem')
    } finally {
      handleSetIsLoadingData(false)
    }
  }

  const handleStartAnimation = async () => {
    try {
      const allEarthquakes = await handleAllEarthquakes()
      handleSetEarthquakes([])

      let currentDate = animation.filters.startDate
      handleSetAnimationCurrentDate(currentDate)
      triggerAnimationLoop(currentDate, allEarthquakes)
      handleAnimationActive(true)
    } catch (err) {}
  }

  const handleStopAnimation = () => {
    clearInterval(animation.loopInterval)
    handleAnimationActive(false)
  }

  const triggerAnimationLoop = (date, earthquakes) => {
    let currentDate = date
    const loopInterval = setInterval(() => {
      handleSetAnimateEarthquake({ currentDate, earthquakes })

      const nextAnimationCurrentDate = dayjs(currentDate).add(animation.filters.range, 'minutes')
      const checkDate = dayjs(nextAnimationCurrentDate).isAfter(dayjs(animation.filters.endDate))
      if (checkDate) {
        clearInterval(loopInterval)
        handleAnimationActive(false)
        return
      }
      currentDate = nextAnimationCurrentDate.format()
    }, 1000)
    handleSetAnimationLoopInterval(loopInterval)
  }

  const handleContinue = () => {
    triggerAnimationLoop(animation.currentDate, animation.allEarthquakes)
    handleAnimationActive(true)
  }

  const handleClear = () => {
    handleSetAnimationCurrentDate(null)
    handleAnimationActive(false)
    handleSetAnimationAllEarthquakes([])
  }

  const handleAgainStart = () => {
    const currentDate = animation.filters.startDate
    handleSetAnimationCurrentDate(currentDate)
    triggerAnimationLoop(currentDate, animation.allEarthquakes)
    handleAnimationActive(true)
  }

  const getButton = () => {
    switch (true) {
      case !animation.currentDate && !animation.isActive:
        return (
          <Button data-testid={testid.startButton} fullWidth disabled={isLoadingData} variant="contained" onClick={handleStartAnimation}>
            {t('start')}
          </Button>
        )
      case animation.currentDate && animation.isActive:
        return (
          <Button data-testid={testid.stopButton} fullWidth color="error" variant="contained" onClick={handleStopAnimation}>
            {t('stop')}
          </Button>
        )
      case animation.currentDate && !animation.isActive:
        return (
          <div data-testid={testid.decideButtons} className="animation-actions__decide-buttons">
            <Button data-testid={testid.clearButton} fullWidth color="error" variant="contained" onClick={handleClear}>
              {t('clear')}
            </Button>
            {isCompletedAnimation ? (
              <Button fullWidth color="inherit" variant="contained" onClick={handleAgainStart}>
                {t('again start')}
              </Button>
            ) : (
              <Button data-testid={testid.continueButton} fullWidth color="info" variant="contained" onClick={handleContinue}>
                {t('continue')}
              </Button>
            )}
          </div>
        )
      default:
        return <div />
    }
  }

  useEffect(() => {
    if (animation.isActive && animation.loopInterval) {
      handleStopAnimation()
      handleContinue()
    }
  }, [animation.filters.range])

  return (
    <div data-testid={testid.container} className="animation-actions">
      {getButton()}
    </div>
  )
}

export default ActionButtons
