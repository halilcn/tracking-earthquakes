export const LOCAL_STORAGE_KEYS = {
  MAP_TYPE: 'MAP_TYPE',
  LEFT_PANEL_STATUS: 'LEFT_PANEL_STATUS',
  LEFT_PANEL_TYPE: 'LEFT_PANEL_TYPE',
  LANGUAGE: 'LANGUAGE',
  FAULT_LINE: 'FAULT_LINE',
  NEW_EARTHQUAKE_SOUND_NOTIFICATION: 'NEW_EARTHQUAKE_SOUND_NOTIFICATION',
  LAST_LOCATION: 'LAST_LOCATION',
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

export const setNewEarthquakeSoundNotification = status =>
  localStorage.setItem(LOCAL_STORAGE_KEYS.NEW_EARTHQUAKE_SOUND_NOTIFICATION, status)
export const getNewEarthquakeSoundNotification = () => localStorage.getItem(LOCAL_STORAGE_KEYS.NEW_EARTHQUAKE_SOUND_NOTIFICATION)

export const setMapLastLocation = location => localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_LOCATION, JSON.stringify(location))
export const getMapLastLocation = () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOCATION))
