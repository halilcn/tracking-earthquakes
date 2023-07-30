export const URL_QUERY_PARAMS = {
  LAT_LONG: 'lat_long',
  PAST_EARTHQUAKE_DATES: 'past_earthquake_dates',
  EARTHQUAKE_ID: 'earthquake_id',
  FILTERS: 'earthquake_filters',
  MAGNITUDE: 'magnitude',
  DEPTH: 'depth',
  TIME: 'time',
  SOURCES: 'sources',
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
export const setPastEarthquakeDatesQueryParam = (dates, url = new URL(window.location.href)) => {
  const { startDate, endDate } = dates
  url.searchParams.set(URL_QUERY_PARAMS.PAST_EARTHQUAKE_DATES, `${startDate}/${endDate}`)
  return url
}
export const deletePastEarthquakeDatesQueryParam = (url = new URL(window.location.href)) => {
  url.searchParams.delete(URL_QUERY_PARAMS.PAST_EARTHQUAKE_DATES)
  return url
}

export const getEarthquakeIDQueryParam = () => urlParams.get(URL_QUERY_PARAMS.EARTHQUAKE_ID)
export const setEarthquakeIDQueryParam = (earthquakeID, url = new URL(window.location.href)) => {
  url.searchParams.set(URL_QUERY_PARAMS.EARTHQUAKE_ID, earthquakeID)
  return url
}
export const deleteEarthquakeIDQueryParam = (url = new URL(window.location.href)) => {
  url.searchParams.delete(URL_QUERY_PARAMS.EARTHQUAKE_ID)
  return url
}

export const getEarthquakeFiltersQueryParam = () => {
  try {
    const newUrlParams = new URLSearchParams(window.location.search)
    return JSON.parse(newUrlParams.get(URL_QUERY_PARAMS.FILTERS))
  } catch {
    return {}
  }
}
export const setEarthquakeFiltersQueryParam = (filters, url = new URL(window.location.href)) => {
  url.searchParams.set(URL_QUERY_PARAMS.FILTERS, JSON.stringify(filters))
  return url
}
export const updateEarthquakeQueryParams = payload => {
  const { key, value, url = new URL(window.location.href) } = payload
  const filters = { ...(getEarthquakeFiltersQueryParam() || {}), [key]: value }

  return setEarthquakeFiltersQueryParam(filters, url)
}
export const deleteEarthquakeFiltersQueryParam = (url = new URL(window.location.href)) => {
  url.searchParams.delete(URL_QUERY_PARAMS.FILTERS)
  return url
}
