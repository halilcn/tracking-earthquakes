import { createSlice } from '@reduxjs/toolkit'

import {
  DEFAULT_ANIMATION_RANGE,
  DEFAULT_API_DATE_FORMAT,
  DEFAULT_DEPTH_FILTER,
  DEFAULT_MAGNITUDE_FILTER_VALUE,
  DEFAULT_SOURCE_FILTER,
  DEFAULT_TIME_FILTER_VALUE,
} from '../constants'
import dayjs from '../utils/dayjs'
import { getFaultLineActive, getNewEarthquakeSoundNotification } from '../utils/localStorageActions'
import { getEarthquakeFiltersQueryParam, getPastEarthquakeDatesQueryParam } from '../utils/queryParamsActions'

export const defaultEarthquakeArchiveDateState = { certainDate: null, startDate: null, endDate: null }
export const defaultEarthquakeFilterState = {
  time: DEFAULT_TIME_FILTER_VALUE,
  magnitude: DEFAULT_MAGNITUDE_FILTER_VALUE,
  depth: DEFAULT_DEPTH_FILTER,
  sources: DEFAULT_SOURCE_FILTER,
}

const getArchiveDateState = () => {
  const queryPastEarthquakeDates = getPastEarthquakeDatesQueryParam()

  try {
    const [startDate, endDate] = queryPastEarthquakeDates.split('/')

    const isValid = dayjs(startDate, DEFAULT_API_DATE_FORMAT, true).isValid() && dayjs(endDate, DEFAULT_API_DATE_FORMAT, true).isValid()
    if (!isValid) return defaultEarthquakeArchiveDateState

    return { ...defaultEarthquakeArchiveDateState, startDate, endDate }
  } catch {
    return defaultEarthquakeArchiveDateState
  }
}
const getEarthquakeFilterState = () => {
  const validatedEarthquakeFilterKeys = Object.keys(defaultEarthquakeFilterState)
  const filters = getEarthquakeFiltersQueryParam() || {}
  const validatedFilters = Object.keys(filters).reduce((acc, key) => {
    if (validatedEarthquakeFilterKeys.includes(key)) {
      return { ...acc, [key]: filters[key] }
    }

    return acc
  }, {})

  return {
    ...defaultEarthquakeFilterState,
    ...validatedFilters,
  }
}

export const initialState = {
  earthquakes: [],
  earthquakeAffectedDistance: {},
  earthquakeFilter: getEarthquakeFilterState(),
  earthquakeNotification: {
    newEarthquakeSound: getNewEarthquakeSoundNotification() === 'true',
  },
  customPoints: [],
  mapCurrent: null,
  isActiveCustomPointSelection: false,
  customPointCoordinates: null,
  isLoadingData: false,
  archiveDate: getArchiveDateState(),
  faultLineActive: !(getFaultLineActive() === 'false'),
  animation: {
    filters: {
      startDate: dayjs().add(-5, 'days').startOf('day').format(),
      endDate: dayjs().format(),
      range: DEFAULT_ANIMATION_RANGE,
    },
    currentDate: null,
    isActive: false,
    allEarthquakes: [],
    loopInterval: null,
  },
}

export const earthquake = createSlice({
  name: 'earthquake',
  initialState,
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
    setEarthquakeNotification: (state, actions) => {
      state.earthquakeNotification = { ...state.earthquakeNotification, ...actions.payload }
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
    setFaultLineActive: (state, actions) => {
      state.faultLineActive = actions.payload
    },
    setAnimationFilter: (state, actions) => {
      state.animation.filters = { ...state.animation.filters, ...actions.payload }
    },
    setAnimationCurrentDate: (state, actions) => {
      state.animation.currentDate = actions.payload
    },
    updateAnimationIsActive: (state, actions) => {
      state.animation.isActive = actions.payload
    },
    setAnimationAllEarthquakes: (state, actions) => {
      state.animation.allEarthquakes = actions.payload
    },
    setAnimationLoopInterval: (state, actions) => {
      state.animation.loopInterval = actions.payload
    },
  },
})

export const isSelectedAnyArchiveItem = state => {
  const { archiveDate } = state.earthquake
  return archiveDate.certainDate || (archiveDate.startDate && archiveDate.endDate)
}
export const isSelectedAnyFilterPanelItem = state => {
  const earthquakeFilter = state.earthquake.earthquakeFilter
  const time = earthquakeFilter.time !== DEFAULT_TIME_FILTER_VALUE
  const isLiveEarthquake = !state.earthquake.animation.isActive && !isSelectedAnyArchiveItem(state)
  const magnitude = earthquakeFilter.magnitude !== DEFAULT_MAGNITUDE_FILTER_VALUE
  const depth = earthquakeFilter.depth !== DEFAULT_DEPTH_FILTER
  const sources = earthquakeFilter.sources.filter(source => DEFAULT_SOURCE_FILTER.includes(source)).length !== DEFAULT_SOURCE_FILTER.length

  return (time && isLiveEarthquake) || magnitude || depth || sources
}

export const earthquakeActions = earthquake.actions
export default earthquake.reducer
