const LOCAL_STORAGE_MAP_TYPE = 'MAP_TYPE'

export const setMapType = mapType => localStorage.setItem(LOCAL_STORAGE_MAP_TYPE, mapType)
export const getMapType = () => localStorage.getItem(LOCAL_STORAGE_MAP_TYPE)
