export const LOCAL_STORAGE_KEYS = {
  MAP_TYPE: 'MAP_TYPE',
  LEFT_PANEL_STATUS: 'LEFT_PANEL_STATUS',
  LEFT_PANEL_TYPE: 'LEFT_PANEL_TYPE',
  LANGUAGE: 'LANGUAGE',
  FAULT_LINE: 'FAULT_LINE',
  POPULATION_DENSITY: 'POPULATION_DENSITY',
  SOURCE_COLOR: 'SOURCE_COLOR',
  NEW_EARTHQUAKE_SOUND_NOTIFICATION: 'NEW_EARTHQUAKE_SOUND_NOTIFICATION',
  FIRST_GUID_STATUS: 'FIRST_GUID_STATUS',
  USER_TOKEN: 'USER_TOKEN',
  COLLAPSED_TOP_HEADER: 'COLLAPSED_TOP_HEADER',
}

export const setMapType = mapType => localStorage.setItem(LOCAL_STORAGE_KEYS.MAP_TYPE, mapType)
export const getMapType = () => localStorage.getItem(LOCAL_STORAGE_KEYS.MAP_TYPE)

export const setLeftPanelStatus = status => localStorage.setItem(LOCAL_STORAGE_KEYS.LEFT_PANEL_STATUS, status)
export const getLeftPanelStatus = () => localStorage.getItem(LOCAL_STORAGE_KEYS.LEFT_PANEL_STATUS)

export const setLeftPanelType = type => localStorage.setItem(LOCAL_STORAGE_KEYS.LEFT_PANEL_TYPE, type)
export const getLeftPanelType = () => localStorage.getItem(LOCAL_STORAGE_KEYS.LEFT_PANEL_TYPE)

export const setLanguage = lang => localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang)
export const getLanguage = () => localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE)

export const setFaultLineActive = status => localStorage.setItem(LOCAL_STORAGE_KEYS.FAULT_LINE, status)
export const getFaultLineActive = () => localStorage.getItem(LOCAL_STORAGE_KEYS.FAULT_LINE)

export const setPopulationDensityActive = status => localStorage.setItem(LOCAL_STORAGE_KEYS.POPULATION_DENSITY, status)
export const getPopulationDensityActive = () => localStorage.getItem(LOCAL_STORAGE_KEYS.POPULATION_DENSITY)

export const setSourceColorActive = status => localStorage.setItem(LOCAL_STORAGE_KEYS.SOURCE_COLOR, status)
export const getSourceColorActive = () => localStorage.getItem(LOCAL_STORAGE_KEYS.SOURCE_COLOR)

export const setNewEarthquakeSoundNotification = status =>
  localStorage.setItem(LOCAL_STORAGE_KEYS.NEW_EARTHQUAKE_SOUND_NOTIFICATION, status)
export const getNewEarthquakeSoundNotification = () => localStorage.getItem(LOCAL_STORAGE_KEYS.NEW_EARTHQUAKE_SOUND_NOTIFICATION)

export const setFirstGuideStatus = status => localStorage.setItem(LOCAL_STORAGE_KEYS.FIRST_GUID_STATUS, status)
export const getFirstGuideStatus = () => localStorage.getItem(LOCAL_STORAGE_KEYS.FIRST_GUID_STATUS)

export const setUserToken = token => localStorage.setItem(LOCAL_STORAGE_KEYS.USER_TOKEN, token)
export const getUserToken = () => localStorage.getItem(LOCAL_STORAGE_KEYS.USER_TOKEN)
export const removeUserToken = () => localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_TOKEN)

export const setCollapsedTopHeader = status => localStorage.setItem(LOCAL_STORAGE_KEYS.COLLAPSED_TOP_HEADER, status)
export const getCollapsedTopHeader = () => localStorage.getItem(LOCAL_STORAGE_KEYS.COLLAPSED_TOP_HEADER)
