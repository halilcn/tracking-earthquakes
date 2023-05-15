const KEY = {
  MAP_TYPE: 'MAP_TYPE',
  LEFT_PANEL_STATUS: 'LEFT_PANEL_STATUS',
  LEFT_PANEL_TYPE: 'LEFT_PANEL_TYPE',
  LANGUAGE: 'LANGUAGE',
}

export const setMapType = mapType => localStorage.setItem(KEY.MAP_TYPE, mapType)
export const getMapType = () => localStorage.getItem(KEY.MAP_TYPE)

export const setLeftPanelStatus = status => localStorage.setItem(KEY.LEFT_PANEL_STATUS, status)
export const getLeftPanelStatus = () => localStorage.getItem(KEY.LEFT_PANEL_STATUS)

export const setLeftPanelType = type => localStorage.setItem(KEY.LEFT_PANEL_TYPE, type)
export const getLeftPanelType = () => localStorage.getItem(KEY.LEFT_PANEL_TYPE)

export const setLanguage = lang => localStorage.setItem(KEY.LANGUAGE, lang)
export const getLanguage = () => localStorage.getItem(KEY.LANGUAGE)
