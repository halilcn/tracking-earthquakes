import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_DEPTH_FILTER, DEFAULT_MAGNITUDE_FILTER_VALUE, DEFAULT_TIME_FILTER_VALUE } from '../constants'

export const earthquake = createSlice({
  name: 'earthquake',
  initialState: {
    earthquakes: [],
    earthquakeAffectedDistance: {},
    earthquakeTimeFilter: DEFAULT_TIME_FILTER_VALUE,
    earthquakeMagnitudeFilter: DEFAULT_MAGNITUDE_FILTER_VALUE,
    earthquakeDepthFilter: DEFAULT_DEPTH_FILTER,
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
    setEarthquakeTimeFilter: (state, actions) => {
      state.earthquakeTimeFilter = actions.payload
    },
    setEarthquakeMagnitudeFilter: (state, actions) => {
      state.earthquakeMagnitudeFilter = actions.payload
    },
    setEarthquakeDepthFilter: (state, actions) => {
      state.earthquakeDepthFilter = actions.payload
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
      state.earthquakeTimeFilter = DEFAULT_TIME_FILTER_VALUE
      state.earthquakeMagnitudeFilter = DEFAULT_MAGNITUDE_FILTER_VALUE
    },
  },
})

export const isSelectedAnyArchiveItem = state => Object.values(state.earthquake.archiveDate).some(item => item !== null)
export const isSelectedAnyFilterPanelItem = state => {
  return (
    state.earthquake.earthquakeTimeFilter !== DEFAULT_TIME_FILTER_VALUE ||
    state.earthquake.earthquakeMagnitudeFilter !== DEFAULT_MAGNITUDE_FILTER_VALUE
  )
}

export const earthquakeActions = earthquake.actions
export default earthquake.reducer
