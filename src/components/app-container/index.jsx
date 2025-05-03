import { motion } from 'framer-motion'
import introJs from 'intro.js'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getMe } from '../../api'
import audio from '../../assets/sounds/new-earthquake.mp3'
import { MAP_TIMER_ACTION, MAP_TIMER_STATUS, MAP_UPDATE_MIN } from '../../constants'
import constantsTestid from '../../constants/testid'
import useEffectIgnoreFirstRender from '../../hooks/useEffectIgnoreFirstRender'
import { getAllEarthquakes } from '../../service/earthquakes'
import { authActions, isLoggedInSelector } from '../../store/auth'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../store/earthquake'
import { isMobile } from '../../utils'
import { getFirstGuideStatus, removeUserToken, setFirstGuideStatus } from '../../utils/localStorageActions'
import ErrorPage from '../error-page'
import PageTop from '../page-top'
import TrackingMap from '../tracking-map'
import AppLoading from './app-loading'
import './index.scss'

export const TOP_HEADER_HEIGHT = isMobile() ? 45 : 70

const AppContainer = () => {
  const testid = constantsTestid.appContainer
  const dispatch = useDispatch()
  const earthquakeIntervalRef = useRef(null)
  const notifiedNewEarthquakeIdsRef = useRef([])

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const selectedArchiveItem = useSelector(isSelectedAnyArchiveItem)
  const { newEarthquakeSound, animationCurrentDate, archiveDate, forceUpdate } = useSelector(state => {
    const { earthquakeNotification, animation, archiveDate, forceUpdate } = state.earthquake

    return {
      archiveDate,
      forceUpdate,
      newEarthquakeSound: earthquakeNotification.newEarthquakeSound,
      animationCurrentDate: animation.currentDate,
    }
  })
  const isLoggedIn = useSelector(isLoggedInSelector)
  const { isCollapsedTopHeader } = useSelector(state => state.app)

  const hasArchiveDates = !!archiveDate.startDate && !!archiveDate.endDate

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
    if (newEarthquakeSound) handleNewEarthquakeNotification({ earthquakes, newEarthquakeNotification })
  }

  const handleNewEarthquakeNotification = payload => {
    const { earthquakes, newEarthquakeNotification } = payload

    const newEarthquakeIDs = earthquakes
      .filter(earthquake => earthquake.properties.isNewEarthquake)
      .reduce((acc, newEarthquake) => [...acc, newEarthquake.properties.earthquake_id], [])
    if (newEarthquakeIDs.length === 0) return
    if (!newEarthquakeNotification) {
      notifiedNewEarthquakeIdsRef.current = [...newEarthquakeIDs]
      return
    }

    const isNotifiedAllNewEarthquakes = newEarthquakeIDs.every(earthquakeID => notifiedNewEarthquakeIdsRef.current.includes(earthquakeID))
    if (isNotifiedAllNewEarthquakes) return

    const sound = new Audio(audio)
    sound.play()

    notifiedNewEarthquakeIdsRef.current = [...new Set([...notifiedNewEarthquakeIdsRef.current, ...newEarthquakeIDs])]
  }

  const handleGetMe = async () => {
    const res = await getMe()
    dispatch(authActions.setUser(res.data.user))
  }

  const firstHandleRequests = async () => {
    try {
      const getEarthquakesPayload = {
        newEarthquakeNotification: false,
        ...(hasArchiveDates
          ? {
              params: { endDate: archiveDate.endDate, startDate: archiveDate.startDate },
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
    } catch (err) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const createEarthquakesInterval = () => {
    if (earthquakeIntervalRef.current) return

    earthquakeIntervalRef.current = setInterval(() => {
      handleGetEarthquakes()
    }, MAP_UPDATE_MIN * 1000)

    dispatch(earthquakeActions.updateMapTimerAction(MAP_TIMER_ACTION.START))
    dispatch(earthquakeActions.updateMapTimerStatus(MAP_TIMER_STATUS.TIMER))
  }

  const removeEarthquakesInterval = () => {
    if (!earthquakeIntervalRef.current) return

    clearInterval(earthquakeIntervalRef.current)
    earthquakeIntervalRef.current = null

    dispatch(earthquakeActions.updateMapTimerAction(MAP_TIMER_ACTION.CLEAR))
  }

  const startFreshEarthquakesProcess = status => async mapTimerStatus => {
    if (status) {
      removeEarthquakesInterval()
      dispatch(earthquakeActions.updateMapTimerStatus(mapTimerStatus))
      return
    }

    dispatch(earthquakeActions.updateMapTimerStatus(MAP_TIMER_STATUS.TIMER))

    await handleGetEarthquakes({
      newEarthquakeNotification: false,
    })
    createEarthquakesInterval()
  }

  useEffect(() => {
    ;(async () => {
      await firstHandleRequests()

      if (hasArchiveDates) {
        dispatch(earthquakeActions.updateMapTimerAction(MAP_TIMER_ACTION.CLEAR))
        dispatch(earthquakeActions.updateMapTimerStatus(MAP_TIMER_STATUS.ARCHIVE))
      } else {
        createEarthquakesInterval()
      }
    })()

    return removeEarthquakesInterval
  }, [])

  // TODO: there is an error related to StrictMode in dev env. It is valid for only dev env
  useEffectIgnoreFirstRender(() => {
    startFreshEarthquakesProcess(!!selectedArchiveItem)(MAP_TIMER_STATUS.ARCHIVE)
  }, [selectedArchiveItem])

  useEffectIgnoreFirstRender(() => {
    startFreshEarthquakesProcess(!!animationCurrentDate)(MAP_TIMER_STATUS.ANIMATION)
  }, [animationCurrentDate])

  useEffect(() => {
    if (!forceUpdate) return
    ;(async () => {
      removeEarthquakesInterval()

      await handleGetEarthquakes({
        newEarthquakeNotification: false,
      })
      createEarthquakesInterval()

      dispatch(earthquakeActions.updateForceUpdate(false))
    })()
  }, [forceUpdate])

  useEffect(() => {
    if (!hasError && !isLoading && getFirstGuideStatus() !== 'true') {
      handleIntroSteps()
      setFirstGuideStatus(true)
    }
  }, [hasError, isLoading])

  const topHeaderProps = {
    className: 'app-container__top',
    animate: isCollapsedTopHeader ? 'closed' : 'open',
    initial: false,
    variants: {
      closed: {
        transform: `translateY(-${TOP_HEADER_HEIGHT}px)`,
        marginBottom: -TOP_HEADER_HEIGHT,
        transition: {
          transform: { duration: 0.35, ease: 'easeInOut' },
          marginBottom: { duration: 0.3, ease: 'easeOut' },
        },
      },
      open: {
        transform: 'translateY(0)',
        marginBottom: 0,
        transition: {
          transform: { duration: 0.3, ease: 'easeOut' },
          marginBottom: { duration: 0.35, ease: 'easeInOut' },
        },
        transitionEnd: {
          transform: 'none',
        },
      },
    },
    'data-testid': testid.top,
  }

  return (
    <div data-testid={testid.appContainer} className="app-container">
      {isLoading && <AppLoading />}
      {hasError && <ErrorPage />}
      {!hasError && !isLoading && (
        <>
          <motion.div {...topHeaderProps}>
            <PageTop />
          </motion.div>
          <div data-testid={testid.content} className="app-container__content">
            <TrackingMap />
          </div>
        </>
      )}
    </div>
  )
}

export default AppContainer
