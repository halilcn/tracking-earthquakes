import { getEarthquakesInTurkey } from '../api'

export const getAllEarthquakesByUsingKandilliAPI = async params => {
  const allEarthquakes = []
  while (true) {
    const responseEarthquakes = await getEarthquakesInTurkey({ ...params, skip: allEarthquakes.length })
    allEarthquakes.push(...responseEarthquakes.result)

    if (responseEarthquakes.metadata.total - 1 < allEarthquakes.length) break
  }

  return allEarthquakes
}
