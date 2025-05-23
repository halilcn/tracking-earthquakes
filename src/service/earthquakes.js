import { getEarthquakesInTurkey, getEarthquakesInWorld } from '../api'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../utils'
import dayjs from '../utils/dayjs'

const getAllEarthquakesByUsingKandilliAPI = async params => {
  const allEarthquakes = []
  while (true) {
    const responseEarthquakes = await getEarthquakesInTurkey({ ...params, skip: allEarthquakes.length })
    allEarthquakes.push(...responseEarthquakes.result)

    if (responseEarthquakes.metadata.total - 1 < allEarthquakes.length) break
  }

  return allEarthquakes
}

export const handleEarthquakesKandilli = async (payload = {}) => {
  const params = {
    date_end: payload?.endDate ?? convertDateFormatForAPI(dayjs()),
    date: payload?.startDate ?? convertDateFormatForAPI(dayjs().add(-1, 'day')),
  }
  const earthquakes = await getAllEarthquakesByUsingKandilliAPI(params)
  const preparedEarthquakesData = earthquakes.map(earthquake => prepareEarthquakeKandilli(earthquake))
  return preparedEarthquakesData
}

const normalizePayloadDatesForOneDay = payload => ({ ...payload, endDate: convertDateFormatForAPI(dayjs(payload.endDate).add(1, 'day')) })
export const handleEarthquakesUsgs = async (_payload = {}) => {
  const isSameDate = Object.keys(_payload).length > 0 && dayjs(_payload?.startDate).isSame(dayjs(_payload?.endDate))
  const payload = isSameDate ? normalizePayloadDatesForOneDay(_payload) : _payload

  const requestParams = {
    starttime: payload?.startDate ?? convertDateFormatForAPI(dayjs()),
    endtime: payload?.endDate ?? convertDateFormatForAPI(dayjs().add(1, 'day')),
  }
  const { features } = await getEarthquakesInWorld(requestParams)
  const preparedEarthquakesData = features.map(earthquake => prepareEarthquakeUsgs(earthquake))
  return preparedEarthquakesData
}

export const getAllEarthquakes = async (payload = {}) => {
  const allEarthquakes = await Promise.all([handleEarthquakesKandilli(payload), handleEarthquakesUsgs(payload)]).then(result =>
    result.flat()
  )
  return allEarthquakes
}
