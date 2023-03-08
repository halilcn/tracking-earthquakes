import TrackingMap from '../tracking-map'
import { useEffect, useState } from 'react'
import { getCustomPoints, getEarthquakes } from '../../api'
import { useDispatch } from 'react-redux'
import { earthquakeActions } from '../../store/earthquake'
import { userActions } from '../../store/user'
import { prepareEarthquake } from '../../utils'
import EarthquakeList from '../earthquake-list'
import PageTop from '../page-top'
import firebase from '../../service/firebase'
import { MAP_UPDATE_MIN } from '../../constants'
import ErrorPage from '../error-page'
import Loading from '../loading'

import './index.scss'

const AppContainer = () => {
  const dispatch = useDispatch()

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleGetEarthquakes = async () => {
    try {
      const earthquakeResult = (await getEarthquakes()).result
      const preparedEarthquakesData = earthquakeResult.map(earthquake => prepareEarthquake(earthquake))
      dispatch(earthquakeActions.setEarthquakes(preparedEarthquakesData))
    } catch (err) {
      setHasError(true)
      setIsLoading(false)
    }
  }

  const handleGetCustomPoints = async () => {
    const customPoints = await getCustomPoints()

    dispatch(earthquakeActions.setCustomPoints(customPoints))
  }

  const firstGetting = async () => {
    await handleGetEarthquakes()
    await handleGetCustomPoints()
    setIsLoading(false)
  }

  const listenFirebaseAuth = () => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch(userActions.setAuth(user))
      dispatch(userActions.setIsLoadedAuthInformation(true))
    })
  }

  useEffect(() => {
    firstGetting()
    listenFirebaseAuth()

    const getEarthquakesInterval = setInterval(() => {
      handleGetEarthquakes()
    }, MAP_UPDATE_MIN * 1000)

    return () => clearInterval(getEarthquakesInterval)
  }, [])

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
            <EarthquakeList />
            <TrackingMap />
          </div>
        </>
      )}
    </div>
  )
}

export default AppContainer
