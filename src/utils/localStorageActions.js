const LOCAL_STORAGE_MAP_TYPE = 'MAP_TYPE'
const LOCAL_STORAGE_EARTHQUAKE_LIST_STATUS = 'EARTHQUAKE_LIST_STATUS'

export const setMapType = mapType => localStorage.setItem(LOCAL_STORAGE_MAP_TYPE, mapType)
export const getMapType = () => localStorage.getItem(LOCAL_STORAGE_MAP_TYPE)

export const setEarthquakeListStatus = status => localStorage.setItem(LOCAL_STORAGE_EARTHQUAKE_LIST_STATUS, status)
export const getEarthquakeListStatus = () => localStorage.getItem(LOCAL_STORAGE_EARTHQUAKE_LIST_STATUS)
