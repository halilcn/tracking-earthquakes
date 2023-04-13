import TrackingMap from '../tracking-map'
import { useEffect, useRef, useState } from 'react'
import { getCustomPoints, getEarthquakesInTurkey, getEarthquakesInWorld } from '../../api'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../store/earthquake'
import { userActions } from '../../store/user'
import { prepareEarthquake, prepareEarthquakeV2 } from '../../utils'
import EarthquakeList from '../earthquake-list'
import PageTop from '../page-top'
import firebase from '../../service/firebase'
import { MAP_UPDATE_MIN } from '../../constants'
import ErrorPage from '../error-page'
import Loading from '../loading'

import './index.scss'

const AppContainer = () => {
  const dispatch = useDispatch()
  const earthquakeIntervalRef = useRef(null)

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const selectedArchiveItem = useSelector(isSelectedAnyArchiveItem)

  const handleEarthquakesInTurkey = async () => {
    const earthquakeResult = (await getEarthquakesInTurkey()).result
    const preparedEarthquakesData = earthquakeResult.map(earthquake => prepareEarthquake(earthquake))
    console.log('preparedEarthquakesData', preparedEarthquakesData)
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  const handleEarthquakesInWorld = async () => {
    const { features } = await getEarthquakesInWorld()
    const preparedEarthquakesData = features.map(earthquake => prepareEarthquakeV2(earthquake))
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  const handleGetEarthquakes = async () => {
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
      handleGetEarthquakes()
    }, MAP_UPDATE_MIN * 1000)
  }

  const removeEarthquakesInterval = () => {
    clearInterval(earthquakeIntervalRef.current)
    earthquakeIntervalRef.current = null
  }

  useEffect(() => {
    firstGetting()
    listenFirebaseAuth()
    createEarthquakesInterval()
    return removeEarthquakesInterval
  }, [])

  useEffect(() => {
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
            <EarthquakeList />
          </div>
        </>
      )}
    </div>
  )
}

export default AppContainer
