import { getEarthquakesInTurkey, getEarthquakesInWorld } from '../api'
import { SOURCES } from '../constants'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../utils'
import dayjs from '../utils/dayjs'

// TODO: it should used in only this file
export const getAllEarthquakesByUsingKandilliAPI = async params => {
  const allEarthquakes = []
  while (true) {
    const responseEarthquakes = await getEarthquakesInTurkey({ ...params, skip: allEarthquakes.length })
    allEarthquakes.push(...responseEarthquakes.result)

    if (responseEarthquakes.metadata.total - 1 < allEarthquakes.length) break
  }

  return allEarthquakes
}

const handleEarthquakesKandilli = async (payload = {}) => {
  const params = {
    date_end: payload?.endDate ?? convertDateFormatForAPI(dayjs()),
    date: payload?.startDate ?? convertDateFormatForAPI(dayjs().add(-1, 'day')),
  }
  const earthquakes = await getAllEarthquakesByUsingKandilliAPI(params)
  const preparedEarthquakesData = earthquakes.map(earthquake => prepareEarthquakeKandilli(earthquake))
  return preparedEarthquakesData
}

const handleEarthquakesUsgs = async (payload = {}) => {
  const requestParams = {
    starttime: payload?.startDate ?? convertDateFormatForAPI(dayjs().add(-1, 'day')),
    endtime: payload?.endDate ?? convertDateFormatForAPI(dayjs().add(1, 'day')),
  }
  const { features } = await getEarthquakesInWorld(requestParams)
  const preparedEarthquakesData = features.map(earthquake => prepareEarthquakeUsgs(earthquake))
  return preparedEarthquakesData
}

export const getAllEarthquakes = async (payload = {}) => {
  const allEarthquakes = await Promise.all([
    handleEarthquakesKandilli(payload[SOURCES.KANDILLI]),
    handleEarthquakesUsgs(payload[SOURCES.USGS]),
  ]).then(result => result.flat())
  return allEarthquakes
}
