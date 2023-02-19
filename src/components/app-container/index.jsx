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

import './index.scss'
import ErrorPage from '../error-page'

const AppContainer = () => {
  const dispatch = useDispatch()

  const [hasError, setHasError] = useState(false)

  const handleGetEarthquakes = async () => {
    try {
      const earthquakeResult = (await getEarthquakes()).result
      const preparedEarthquakesData = earthquakeResult.map(earthquake => prepareEarthquake(earthquake))
      // TODO: temporarily solution
      setTimeout(() => {
        dispatch(earthquakeActions.setEarthquakes(preparedEarthquakesData))
      }, 1500)
    } catch (err) {
      setHasError(true)
    }
  }

  const handleGetCustomPoints = async () => {
    const customPoints = await getCustomPoints()

    // TODO: temporarily solution
    setTimeout(() => {
      dispatch(earthquakeActions.setCustomPoints(customPoints))
    }, 1500)
  }

  const listenFirebaseAuth = () => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch(userActions.setAuth(user))
      dispatch(userActions.setIsLoadedAuthInformation(true))
    })
  }

  useEffect(() => {
    handleGetEarthquakes()
    handleGetCustomPoints()
    listenFirebaseAuth()

    const getEarthquakesInterval = setInterval(() => {
      handleGetEarthquakes()
    }, MAP_UPDATE_MIN * 1000)

    // return clearInterval(getEarthquakesInterval) // TODO:
  }, [])

  return (
    <div className="app-container">
      {hasError ? (
        <ErrorPage />
      ) : (
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
