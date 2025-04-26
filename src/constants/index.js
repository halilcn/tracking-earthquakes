import i18n from '../i18n'

export const API = {
  KANDILLI: 'https://api.orhanaydogdu.com.tr/deprem',
  USGS: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson',
  BACKEND_V1: 'https://tracking-earthquakes-api-51c3d53af347.herokuapp.com/api/v1',
}

export const INTENSITY_LEVELS = {
  LEVEL_1: 'LEVEL_1',
  LEVEL_2: 'LEVEL_2',
  LEVEL_3: 'LEVEL_3',
  LEVEL_4: 'LEVEL_4',
  LEVEL_5: 'LEVEL_5',
  LEVEL_6: 'LEVEL_6',
}

export const POINT_COLOR = {
  [INTENSITY_LEVELS.LEVEL_1]: '#fed9b1',
  [INTENSITY_LEVELS.LEVEL_2]: '#ffad44',
  [INTENSITY_LEVELS.LEVEL_3]: '#fe8b00',
  [INTENSITY_LEVELS.LEVEL_4]: '#ff5700',
  [INTENSITY_LEVELS.LEVEL_5]: '#ff4400',
  [INTENSITY_LEVELS.LEVEL_6]: '#c0362c',
}

export const POINT_SIZE = {
  [INTENSITY_LEVELS.LEVEL_1]: 4,
  [INTENSITY_LEVELS.LEVEL_2]: 8,
  [INTENSITY_LEVELS.LEVEL_3]: 12,
  [INTENSITY_LEVELS.LEVEL_4]: 16,
  [INTENSITY_LEVELS.LEVEL_5]: 20,
  [INTENSITY_LEVELS.LEVEL_6]: 24,
}

export const FILTER_TIME = {
  1: i18n.t('Last {hourCount} hour').replace('{hourCount}', '1'),
  6: i18n.t('Last {hourCount} hour').replace('{hourCount}', '6'),
  12: i18n.t('Last {hourCount} hour').replace('{hourCount}', '12'),
  24: i18n.t('Last {hourCount} hour').replace('{hourCount}', '24'),
}

export const ARCHIVE_CERTAIN_TIMES = {
  0: i18n.t('Today'),
  1: i18n.t('Last {dayCount} day').replace('{dayCount}', '1'),
  3: i18n.t('Last {dayCount} day').replace('{dayCount}', '3'),
  7: i18n.t('Last {dayCount} day').replace('{dayCount}', '7'),
  15: i18n.t('Last {dayCount} day').replace('{dayCount}', '15'),
  30: i18n.t('Last {dayMonth} month').replace('{dayMonth}', '1'),
  60: i18n.t('Last {dayMonth} month').replace('{dayMonth}', '2'),
}

export const DEFAULT_TIME_FILTER_VALUE = 6

export const FILTER_MAGNITUDE = {
  '-1': i18n.t('All'),
  1: '> 1',
  2: '> 2',
  3: '> 3',
  4: '> 4',
  5: '> 5',
  6: '> 6',
  7: '> 7',
}

export const DEFAULT_MAGNITUDE_FILTER_VALUE = -1

export const MAP_TYPE = {
  DARK: 'mapbox://styles/mapbox/dark-v11',
  '3D': 'mapbox://styles/mapbox/satellite-streets-v12',
  STREET: 'mapbox://styles/mapbox/streets-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  OUTDOOR: 'mapbox://styles/mapbox/outdoors-v12',
}

export const LANGUAGES = {
  'tr-TR': 'TR',
  'en-US': 'EN',
}

export const DEFAULT_DEPTH_FILTER = -1

export const FILTER_DEPTHS = {
  [DEFAULT_DEPTH_FILTER]: i18n.t('All'),
  5: '< 5 km',
  10: '< 10 km',
  15: '< 15 km',
  20: '< 20 km',
  25: '< 25 km',
}

export const MAPBOX_API_KEY = process.env.VITE_MAPBOX_API_KEY

export const MAP_UPDATE_MIN = 60

export const MAP_DEFAULT_COORDINATES = [35.163262, 39.431293]

export const MAP_DEFAULT_ZOOM = 2.5

export const SOURCES = {
  KANDILLI: 'kandilli',
  USGS: 'usgs',
}

export const SOURCE_COLOR = {
  [SOURCES.KANDILLI]: '#4087F2',
  [SOURCES.USGS]: '#F44DF7',
}

export const ANIMATION_RANGES = {
  5: i18n.t('{minCount} minutes').replace('{minCount}', 5),
  15: i18n.t('{minCount} minutes').replace('{minCount}', 15),
  30: i18n.t('{minCount} minutes').replace('{minCount}', 30),
  60: i18n.t('1 hour'),
  [6 * 60]: i18n.t('{hoursCount} hours').replace('{hoursCount}', 6),
  [12 * 60]: i18n.t('{hoursCount} hours').replace('{hoursCount}', 12),
  [24 * 60]: i18n.t('1 day'),
}

export const DEFAULT_ANIMATION_RANGE = 15

export const DEFAULT_API_DATE_FORMAT = 'YYYY-MM-DD'

export const MAPBOX_SOURCES = {
  DATA_EARTHQUAKES: 'data-earthquakes',
  DATA_AFFECTED_DISTANCE: 'data-earthquakes-affected-distance',
  DATA_FAULT_LINE: 'data-fault-line',
  DATA_POPULATION_DENSITY: 'data-population-density',
  LAYER_DATA_CIRCLE: 'data-earthquakes-circle-layer',
  LAYER_DATA_PULSING: 'layer-earthquakes-pulsing',
  LAYER_DATA_AFFECTED_DISTANCE: 'layer-earthquakes-affected-distance',
  LAYER_FAULT_LINE: 'layer-fault-line',
  LAYER_POPULATION_DENSITY: 'layer-population-density',
}

export const SOURCE_COLOR_DISABLE_VALUE = 0

export const SOURCE_COLOR_ENABLE_VALUE = 1.5

export const MESSAGE_OWNER_TYPES = {
  USER: 'user',
  AI: 'ai',
}

export const MESSAGE_TYPES = {
  GENERAL: 'general',
  EARTHQUAKE: 'earthquake',
}

export const SORTING_TYPE_VALUES = {
  DESC: 1,
  ASC: -1,
}

export const MAP_TIMER_ACTION = {
  START: 'START',
  CLEAR: 'CLEAR',
  NONE_ACTION: 'NONE_ACTION',
}

export const MAP_TIMER_STATUS = {
  TIMER: 'TIMER',
  ARCHIVE: 'ARCHIVE',
  ANIMATION: 'ANIMATION',
}

export const GITHUB_URL = 'https://github.com/halilcn/tracking-earthquakes'
