import i18n from '../i18n'

export const API = {
  KANDILLI: 'https://api.orhanaydogdu.com.tr/deprem',
  USGS: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson',
}

export const APP_URL = 'https://tracking-earthquakes.vercel.app'

export const INTENSITY_LEVELS = {
  LEVEL_1: 'LEVEL_1',
  LEVEL_2: 'LEVEL_2',
  LEVEL_3: 'LEVEL_3',
  LEVEL_4: 'LEVEL_4',
  LEVEL_5: 'LEVEL_5',
  LEVEL_6: 'LEVEL_6',
}

export const POINT_COLOR = {
  LEVEL_1: '#fed9b1',
  LEVEL_2: '#ffad44',
  LEVEL_3: '#fe8b00',
  LEVEL_4: '#ff5700',
  LEVEL_5: '#ff4400',
  LEVEL_6: '#c0362c',
}

export const POINT_SIZE = {
  LEVEL_1: 4,
  LEVEL_2: 8,
  LEVEL_3: 12,
  LEVEL_4: 16,
  LEVEL_5: 20,
  LEVEL_6: 24,
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

export const FIREBASE_CONFIG = {
  authDomain: 'tracking-earthquake.firebaseapp.com',
  projectId: 'tracking-earthquake',
  storageBucket: 'tracking-earthquake.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  apiKey: process.env.VITE_FIREBASE_API_KEY,
}

export const FIREBASE_CUSTOM_POINTS_DB_NAME = 'custom-points'

export const SOURCES = {
  KANDILLI: 'kandilli',
  USGS: 'usgs',
}

export const DEFAULT_SOURCE_FILTER = Object.values(SOURCES)

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
