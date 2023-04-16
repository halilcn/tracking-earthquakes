const LOCAL_STORAGE_MAP_TYPE = 'MAP_TYPE'
const LOCAL_STORAGE_LEFT_PANEL_STATUS = 'LEFT_PANEL_STATUS'
const LOCAL_STORAGE_LEFT_PANEL_TYPE = 'LEFT_PANEL_TYPE'

export const setMapType = mapType => localStorage.setItem(LOCAL_STORAGE_MAP_TYPE, mapType)
export const getMapType = () => localStorage.getItem(LOCAL_STORAGE_MAP_TYPE)

export const setLeftPanelStatus = status => localStorage.setItem(LOCAL_STORAGE_LEFT_PANEL_STATUS, status)
export const getLeftPanelStatus = () => localStorage.getItem(LOCAL_STORAGE_LEFT_PANEL_STATUS)

export const setLeftPanelType = type => localStorage.setItem(LOCAL_STORAGE_LEFT_PANEL_TYPE, type)
export const getLeftPanelType = () => localStorage.getItem(LOCAL_STORAGE_LEFT_PANEL_TYPE)
