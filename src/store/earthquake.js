import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_MAGNITUDE_FILTER_VALUE, DEFAULT_TIME_FILTER_VALUE } from '../constants'

export const earthquake = createSlice({
  name: 'earthquake',
  initialState: {
    earthquakes: [],
    earthquakeTimeFilter: DEFAULT_TIME_FILTER_VALUE,
    earthquakeMagnitudeFilter: DEFAULT_MAGNITUDE_FILTER_VALUE,
    customPoints: [],
    mapCurrent: null,
    isActiveCustomPointSelection: false,
    customPointCoordinates: null,
  },
  reducers: {
    setEarthquakes: (state, actions) => {
      state.earthquakes = actions.payload
    },
    setEarthquakeTimeFilter: (state, actions) => {
      state.earthquakeTimeFilter = actions.payload
    },
    setEarthquakeMagnitudeFilter: (state, actions) => {
      state.earthquakeMagnitudeFilter = actions.payload
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
  },
})

export const earthquakeActions = earthquake.actions
export default earthquake.reducer
