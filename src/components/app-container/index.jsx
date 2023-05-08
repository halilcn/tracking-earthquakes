import TrackingMap from '../tracking-map'
import { useEffect, useRef, useState } from 'react'
import { getCustomPoints, getEarthquakesInWorld } from '../../api'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../store/earthquake'
import { userActions } from '../../store/user'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../../utils'
import PageTop from '../page-top'
import firebase from '../../service/firebase'
import { DEFAULT_LANGUAGE, MAP_UPDATE_MIN } from '../../constants'
import ErrorPage from '../error-page'
import Loading from '../loading'
import dayjs from 'dayjs'
import { getAllEarthquakesByUsingKandilliAPI } from '../../service/earthquakes'
import { useTranslation } from 'react-i18next'
import { getLanguage, setLanguage } from '../../utils/localStorageActions'

import './index.scss'
import useEffectIgnoreFirstRender from '../../hooks/useEffectIgnoreFirstRender'

const AppContainer = () => {
  const dispatch = useDispatch()
  const earthquakeIntervalRef = useRef(null)

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const selectedArchiveItem = useSelector(isSelectedAnyArchiveItem)
  const { i18n } = useTranslation()

  const handleEarthquakesInTurkey = async () => {
    const params = {
      date_end: convertDateFormatForAPI(dayjs()),
      date: convertDateFormatForAPI(dayjs().add(-1, 'day')),
    }
    const earthquakes = await getAllEarthquakesByUsingKandilliAPI(params)
    const preparedEarthquakesData = earthquakes.map(earthquake => prepareEarthquakeKandilli(earthquake))
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  // TODO: maybe common function for archive data?
  const handleEarthquakesInWorld = async () => {
    const requestParams = {
      starttime: convertDateFormatForAPI(dayjs()),
      endtime: convertDateFormatForAPI(dayjs().add(1, 'day')),
    }
    const { features } = await getEarthquakesInWorld(requestParams)
    const preparedEarthquakesData = features.map(earthquake => prepareEarthquakeUsgs(earthquake))
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  const handleGetEarthquakes = async () => {
    dispatch(earthquakeActions.setEarthquakes([]))
    await handleEarthquakesInTurkey()
    await handleEarthquakesInWorld()
  }

  const handleGetCustomPoints = async () => {
    const customPoints = await getCustomPoints()

    dispatch(earthquakeActions.setCustomPoints(customPoints))
  }

  const firstGetting = async () => {
    try {
      await handleGetEarthquakes()
      await handleGetCustomPoints()
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
      dispatch(earthquakeActions.setEarthquakes([]))
      handleGetEarthquakes()
    }, MAP_UPDATE_MIN * 1000)
  }

  const removeEarthquakesInterval = () => {
    clearInterval(earthquakeIntervalRef.current)
    earthquakeIntervalRef.current = null
  }

  const handleChangeLanguage = () => {
    let language = getLanguage()
    if (language) return

    const browserLanguage = navigator.language.split('-')[0]
    language = browserLanguage || DEFAULT_LANGUAGE
    setLanguage(language)
    i18n.changeLanguage(language)
  }

  useEffect(() => {
    firstGetting()
    listenFirebaseAuth()
    createEarthquakesInterval()
    handleChangeLanguage()
    return removeEarthquakesInterval
  }, [])

  // TODO: should it be in filter-archive comp. ?
  useEffectIgnoreFirstRender(() => {
    if (selectedArchiveItem) {
      removeEarthquakesInterval()
      return
    }
    handleGetEarthquakes()
    createEarthquakesInterval()
    return removeEarthquakesInterval
  }, [selectedArchiveItem])

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
