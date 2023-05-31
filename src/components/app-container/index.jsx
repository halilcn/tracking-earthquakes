import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCustomPoints, getEarthquakesInWorld } from '../../api'
import audio from '../../assets/sounds/new-earthquake.mp3'
import { MAP_UPDATE_MIN } from '../../constants'
import useEffectIgnoreFirstRender from '../../hooks/useEffectIgnoreFirstRender'
import { getAllEarthquakesByUsingKandilliAPI } from '../../service/earthquakes'
import firebase from '../../service/firebase'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../store/earthquake'
import { userActions } from '../../store/user'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../../utils'
import ErrorPage from '../error-page'
import Loading from '../loading'
import PageTop from '../page-top'
import TrackingMap from '../tracking-map'
import dayjs from './../../utils/dayjs'
import './index.scss'

const AppContainer = () => {
  const dispatch = useDispatch()
  const earthquakeIntervalRef = useRef(null)

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const selectedArchiveItem = useSelector(isSelectedAnyArchiveItem)
  const newEarthquakeSound = useSelector(state => state.earthquake.earthquakeNotification.newEarthquakeSound)
  const animationCurrentDate = useSelector(state => state.earthquake.animation.currentDate)

  const handleEarthquakesInTurkey = async () => {
    const params = {
      date_end: convertDateFormatForAPI(dayjs()),
      date: convertDateFormatForAPI(dayjs().add(-1, 'day')),
    }
    const earthquakes = await getAllEarthquakesByUsingKandilliAPI(params)
    const preparedEarthquakesData = earthquakes.map(earthquake => prepareEarthquakeKandilli(earthquake))
    return preparedEarthquakesData
  }

  const handleEarthquakesInWorld = async () => {
    const requestParams = {
      starttime: convertDateFormatForAPI(dayjs().add(-1, 'day')),
      endtime: convertDateFormatForAPI(dayjs().add(1, 'day')),
    }
    const { features } = await getEarthquakesInWorld(requestParams)
    const preparedEarthquakesData = features.map(earthquake => prepareEarthquakeUsgs(earthquake))
    return preparedEarthquakesData
  }

  const handleGetEarthquakes = async () => {
    dispatch(earthquakeActions.setIsLoadingData(true))
    const earthquakes = await Promise.all([handleEarthquakesInTurkey(), handleEarthquakesInWorld()]).then(result => result.flat())
    dispatch(earthquakeActions.setEarthquakes(earthquakes))
    if (newEarthquakeSound) handleNewEarthquakeNotification(earthquakes)
    dispatch(earthquakeActions.setIsLoadingData(false))
  }

  const handleNewEarthquakeNotification = earthquakes => {
    const hasNewEarthquakes = earthquakes.some(earthquake => earthquake.properties.isNewEarthquake)
    if (hasNewEarthquakes) {
      const sound = new Audio(audio)
      sound.play()
    }
  }

  const handleGetCustomPoints = async () => {
    const customPoints = await getCustomPoints()

    dispatch(earthquakeActions.setCustomPoints(customPoints))
  }

  const firstGetting = async () => {
    try {
      await handleGetEarthquakes()
      //await handleGetCustomPoints() // for now it is disabled.
    } catch (err) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const listenFirebaseAuth = () => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch(userActions.setAuth(user))
      dispatch(userActions.setIsLoadedAuthInformation(true))
    })
  }

  const createEarthquakesInterval = () => {
    if (earthquakeIntervalRef.current) return
    earthquakeIntervalRef.current = setInterval(() => {
      handleGetEarthquakes()
    }, MAP_UPDATE_MIN * 1000)
  }

  const removeEarthquakesInterval = () => {
    clearInterval(earthquakeIntervalRef.current)
    earthquakeIntervalRef.current = null
  }

  const startFreshEarthquakesProcess = status => {
    if (status) {
      removeEarthquakesInterval()
      return
    }
    handleGetEarthquakes()
    createEarthquakesInterval()
    return removeEarthquakesInterval
  }

  useEffect(() => {
    firstGetting()
    listenFirebaseAuth()
    createEarthquakesInterval()
    return removeEarthquakesInterval
  }, [])

  useEffectIgnoreFirstRender(() => {
    return startFreshEarthquakesProcess(selectedArchiveItem)
  }, [selectedArchiveItem])

  useEffectIgnoreFirstRender(() => {
    return startFreshEarthquakesProcess(animationCurrentDate)
  }, [animationCurrentDate])

  return (
    <div className="app-container">
      {isLoading && <Loading />}
      {hasError && <ErrorPage />}
      {!hasError && !isLoading && (
        <>
          <div className="app-container__top">
            <PageTop />
          </div>
          <div className="app-container__content">
            <TrackingMap />
          </div>
        </>
      )}
    </div>
  )
}

export default AppContainer
