export const URL_QUERY_PARAMS = {
  LAT_LONG: 'lat_long',
  PAST_EARTHQUAKE_DATES: 'past_earthquake_dates',
  EARTHQUAKE_ID: 'earthquake_id',
}

const urlParams = new URLSearchParams(window.location.search)

export const getLatLongQueryParam = () => {
  try {
    return JSON.parse(urlParams.get(URL_QUERY_PARAMS.LAT_LONG))
  } catch {
    return null
  }
}
export const setLatLongQueryParam = (coordinates, url = new URL(window.location.href)) => {
  url.searchParams.set(URL_QUERY_PARAMS.LAT_LONG, JSON.stringify(coordinates))
  return url
}

export const getPastEarthquakeDatesQueryParam = () => urlParams.get(URL_QUERY_PARAMS.PAST_EARTHQUAKE_DATES)
export const setPastEarthquakeDatesQueryParam = (url, dates) => {
  const { startDate, endDate } = dates
  url.searchParams.set(URL_QUERY_PARAMS.PAST_EARTHQUAKE_DATES, `${startDate}/${endDate}`)
  return url
}

export const getEarthquakeIDQueryParam = () => urlParams.get(URL_QUERY_PARAMS.EARTHQUAKE_ID)
export const setEarthquakeIDQueryParam = (url, earthquakeID) => {
  url.searchParams.set(URL_QUERY_PARAMS.EARTHQUAKE_ID, earthquakeID)
  return url
}
