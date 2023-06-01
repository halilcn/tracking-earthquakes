import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { getEarthquakesInWorld } from '../../../../../api'
import useEarthquakeAnimation from '../../../../../hooks/useEarthquakeAnimation'
import { getAllEarthquakesByUsingKandilliAPI } from '../../../../../service/earthquakes'
import { earthquakeActions } from '../../../../../store/earthquake'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../../../../../utils'
import dayjs from '../../../../../utils/dayjs'
import './index.scss'

const ActionButtons = () => {
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

  // TODO: We need to find a better way to get earthquakes from all sources
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
      handleSetIsLoadingData(true)
      const allEarthquakes = await Promise.all([handleEarthquakesInTurkey(), handleEarthquakesInWorld()]).then(result => result.flat())
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
        handleStopAnimation()
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
          <Button fullWidth disabled={isLoadingData} variant="contained" onClick={handleStartAnimation}>
            {t('start')}
          </Button>
        )
      case animation.currentDate && animation.isActive:
        return (
          <Button fullWidth color="error" variant="contained" onClick={handleStopAnimation}>
            {t('stop')}
          </Button>
        )
      case animation.currentDate && !animation.isActive:
        return (
          <div className="animation-actions__decide-buttons">
            <Button fullWidth color="error" variant="contained" onClick={handleClear}>
              {t('clear')}
            </Button>
            {isCompletedAnimation ? (
              <Button fullWidth color="inherit" variant="contained" onClick={handleAgainStart}>
                {t('again start')}
              </Button>
            ) : (
              <Button fullWidth color="info" variant="contained" onClick={handleContinue}>
                {t('continue')}
              </Button>
            )}
          </div>
        )
      default:
        return <div />
    }
  }

  return <div className="animation-actions">{getButton()}</div>
}

export default ActionButtons
