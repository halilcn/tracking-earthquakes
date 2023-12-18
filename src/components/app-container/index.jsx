import introJs from 'intro.js'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCustomPoints, getMe } from '../../api'
import audio from '../../assets/sounds/new-earthquake.mp3'
import { MAP_UPDATE_MIN } from '../../constants'
import constantsTestid from '../../constants/testid'
import useEffectIgnoreFirstRender from '../../hooks/useEffectIgnoreFirstRender'
import { getAllEarthquakes } from '../../service/earthquakes'
import firebase from '../../service/firebase'
import { authActions, isLoggedInSelector } from '../../store/auth'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../store/earthquake'
import { userActions } from '../../store/user'
import { getFirstGuideStatus, removeUserToken, setFirstGuideStatus } from '../../utils/localStorageActions'
import ErrorPage from '../error-page'
import Loading from '../loading'
import PageTop from '../page-top'
import TrackingMap from '../tracking-map'
import './index.scss'

const AppContainer = () => {
  const testid = constantsTestid.appContainer
  const dispatch = useDispatch()
  const earthquakeIntervalRef = useRef(null)

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const selectedArchiveItem = useSelector(isSelectedAnyArchiveItem)
  const { newEarthquakeSound, animationCurrentDate, archiveDate } = useSelector(state => {
    const { earthquakeNotification, animation, archiveDate } = state.earthquake

    return {
      archiveDate,
      newEarthquakeSound: earthquakeNotification.newEarthquakeSound,
      animationCurrentDate: animation.currentDate,
    }
  })
  const isLoggedIn = useSelector(isLoggedInSelector)

  const handleIntroSteps = async () => {
    const steps = (await import('../../constants/intro-steps')).default

    introJs()
      .setOptions({
        steps,
      })
      .start()
  }

  const handleGetEarthquakes = async payload => {
    const { params = {}, newEarthquakeNotification = true } = payload || {}

    dispatch(earthquakeActions.setIsLoadingData(true))

    const earthquakes = await getAllEarthquakes(params)

    dispatch(earthquakeActions.setEarthquakes(earthquakes))
    dispatch(earthquakeActions.setIsLoadingData(false))
    if (newEarthquakeNotification && newEarthquakeSound) handleNewEarthquakeNotification(earthquakes)
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

  const handleGetMe = async () => {
    const res = await getMe()
    dispatch(authActions.setUser(res.data.user))
  }

  const firstHandleRequests = async () => {
    try {
      const hasArchiveDates = !!archiveDate.startDate && !!archiveDate.endDate
      const getEarthquakesPayload = {
        ...(hasArchiveDates
          ? {
              params: { endDate: archiveDate.endDate, startDate: archiveDate.startDate },
              newEarthquakeNotification: false,
            }
          : {}),
      }

      const [earthquakesRequests, userInfoRequest] = await Promise.allSettled([
        handleGetEarthquakes(getEarthquakesPayload),
        ...(isLoggedIn ? [handleGetMe()] : []),
      ])

      if (userInfoRequest?.status === 'rejected') {
        dispatch(authActions.removeUserToken())
        removeUserToken()
      }

      if (earthquakesRequests?.status === 'rejected') setHasError(true)

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
    if (!earthquakeIntervalRef.current) return

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
    firstHandleRequests()
    listenFirebaseAuth()
    createEarthquakesInterval()
    return removeEarthquakesInterval
  }, [])

  useEffectIgnoreFirstRender(() => {
    return startFreshEarthquakesProcess(!!selectedArchiveItem || !!animationCurrentDate)
  }, [selectedArchiveItem, animationCurrentDate])

  useEffect(() => {
    if (!hasError && !isLoading && getFirstGuideStatus() !== 'true') {
      handleIntroSteps()
      setFirstGuideStatus(true)
    }
  }, [hasError, isLoading])

  return (
    <div data-testid={testid.appContainer} className="app-container">
      {isLoading && <Loading />}
      {hasError && <ErrorPage />}
      {!hasError && !isLoading && (
        <>
          <div data-testid={testid.top} className="app-container__top">
            <PageTop />
          </div>
          <div data-testid={testid.content} className="app-container__content">
            <TrackingMap />
          </div>
        </>
      )}
    </div>
  )
}

export default AppContainer
