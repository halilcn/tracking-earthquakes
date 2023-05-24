import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_DEPTH_FILTER, DEFAULT_MAGNITUDE_FILTER_VALUE, DEFAULT_SOURCE_FILTER, DEFAULT_TIME_FILTER_VALUE } from '../constants'
import { getFaultLineActive } from '../utils/localStorageActions'

export const earthquake = createSlice({
  name: 'earthquake',
  initialState: {
    earthquakes: [],
    earthquakeAffectedDistance: {},
    earthquakeFilter: {
      time: DEFAULT_TIME_FILTER_VALUE,
      magnitude: DEFAULT_MAGNITUDE_FILTER_VALUE,
      depth: DEFAULT_DEPTH_FILTER,
      sources: DEFAULT_SOURCE_FILTER,
    },
    customPoints: [],
    mapCurrent: null,
    isActiveCustomPointSelection: false,
    customPointCoordinates: null,
    isLoadingData: false,
    archiveDate: {
      certainDate: null,
      startDate: null,
      endDate: null,
    },
    faultLineActive: !(getFaultLineActive() === 'false'),
  },
  reducers: {
    setEarthquakes: (state, actions) => {
      state.earthquakes = actions.payload
    },
    addEarthquakes: (state, actions) => {
      state.earthquakes = [...state.earthquakes, ...actions.payload]
    },
    setEarthquakeAffectedDistance: (state, actions) => {
      state.earthquakeAffectedDistance = actions.payload
    },
    setEarthquakeFilter: (state, actions) => {
      state.earthquakeFilter = { ...state.earthquakeFilter, ...actions.payload }
    },
    setMapCurrent: (state, actions) => {
      state.mapCurrent = actions.payload
    },
    setIsActiveCustomPointSelection: (state, actions) => {
      state.isActiveCustomPointSelection = actions.payload || !state.isActiveCustomPointSelection
    },
    setCustomPointCoordinates: (state, actions) => {
      state.customPointCoordinates = actions.payload
    },
    setCustomPoints: (state, actions) => {
      state.customPoints = actions.payload
    },
    addCustomPoints: (state, actions) => {
      state.customPoints = [...state.customPoints, actions.payload]
    },
    setIsLoadingData: (state, actions) => {
      state.isLoadingData = actions.payload
    },
    updateArchiveDate: (state, actions) => {
      state.archiveDate = { ...state.archiveDate, ...actions.payload }
    },
    clearArchiveDate: (state, _) => {
      state.archiveDate = { certainDate: null, startDate: null, endDate: null }
    },
    clearFilterPanelItems: (state, _) => {
      state.earthquakeFilter = {
        ...state.earthquakeFilter,
        time: DEFAULT_TIME_FILTER_VALUE,
        magnitude: DEFAULT_MAGNITUDE_FILTER_VALUE,
        depth: DEFAULT_DEPTH_FILTER,
        sources: DEFAULT_SOURCE_FILTER,
      }
    },
    setFaultLineActive: (state, actions) => {
      state.faultLineActive = actions.payload
    },
  },
})

export const isSelectedAnyArchiveItem = state => Object.values(state.earthquake.archiveDate).some(item => item !== null)
export const isSelectedAnyFilterPanelItem = state => {
  const earthquakeFilter = state.earthquake.earthquakeFilter
  const time = earthquakeFilter.time !== DEFAULT_TIME_FILTER_VALUE
  const magnitude = earthquakeFilter.magnitude !== DEFAULT_MAGNITUDE_FILTER_VALUE
  const depth = earthquakeFilter.depth !== DEFAULT_DEPTH_FILTER
  const sources = earthquakeFilter.sources.filter(source => DEFAULT_SOURCE_FILTER.includes(source)).length !== DEFAULT_SOURCE_FILTER.length

  return time || magnitude || depth || sources
}

export const earthquakeActions = earthquake.actions
export default earthquake.reducer
