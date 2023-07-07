import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { handleEarthquakesKandilli, handleEarthquakesUsgs } from '../service/earthquakes'
import { earthquakeActions } from '../store/earthquake'

const useEarthquakeArchive = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleArchiveEarthquakesKandilli = useCallback(async params => {
    const preparedEarthquakesData = await handleEarthquakesKandilli(params)
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }, [])

  const handleArchiveEarthquakesUsgs = useCallback(async params => {
    const preparedEarthquakesData = await handleEarthquakesUsgs(params)
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }, [])

  const handleGetArchiveEarthquakes = useCallback(async params => {
    try {
      dispatch(earthquakeActions.setIsLoadingData(true))
      dispatch(earthquakeActions.setEarthquakes([]))
      await Promise.all([handleArchiveEarthquakesKandilli(params), handleArchiveEarthquakesUsgs(params)])
    } catch (err) {
      alert(t('Occurred a problem'))
    } finally {
      dispatch(earthquakeActions.setIsLoadingData(false))
    }
  }, [])

  return { handleGetArchiveEarthquakes }
}

export default useEarthquakeArchive
