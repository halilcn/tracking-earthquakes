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

export const getPastEarthquakeDatesQueryParam = () => urlParams.get(URL_QUERY_PARAMS.PAST_EARTHQUAKE_DATES)

export const getEarthquakeIDQueryParam = () => urlParams.get(URL_QUERY_PARAMS.EARTHQUAKE_ID)
