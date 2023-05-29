import TrackingMap from '../tracking-map'
import { useEffect, useRef, useState } from 'react'
import { getCustomPoints, getEarthquakesInWorld } from '../../api'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../store/earthquake'
import { userActions } from '../../store/user'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../../utils'
import PageTop from '../page-top'
import firebase from '../../service/firebase'
import { MAP_UPDATE_MIN } from '../../constants'
import ErrorPage from '../error-page'
import Loading from '../loading'
import dayjs from './../../utils/dayjs'
import { getAllEarthquakesByUsingKandilliAPI } from '../../service/earthquakes'
import useEffectIgnoreFirstRender from '../../hooks/useEffectIgnoreFirstRender'
import audio from '../../assets/sounds/new-earthquake.mp3'

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
    const earthquakes = await Promise.all([handleEarthquakesInTurkey(), handleEarthquakesInWorld()]).then(result => result.flat())
    dispatch(earthquakeActions.setEarthquakes(earthquakes))
    if (newEarthquakeSound) handleNewEarthquakeNotification(earthquakes)
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
