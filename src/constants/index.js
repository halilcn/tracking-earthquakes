export const KANDILLI_EARTHQUAKES_API_BASE_URL = 'https://api.orhanaydogdu.com.tr/deprem'
export const USGS_EARTHQUAKES_API_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'

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
  1: 'Son 1 saat',
  6: 'Son 6 saat',
  12: 'Son 12 saat',
  24: 'Son 24 saat',
}

export const ARCHIVE_CERTAIN_TIMES = {
  0: 'Bugün',
  1: 'Son 1 gün',
  3: 'Son 3 gün',
  7: 'Son 7 gün',
  15: 'Son 15 gün',
  30: 'Son 1 ay',
}

export const DEFAULT_TIME_FILTER_VALUE = 6

export const FILTER_MAGNITUDE = {
  1: '> 1',
  2: '> 2',
  3: '> 3',
  4: '> 4',
  5: '> 5',
  6: '> 6',
  7: '> 7',
}

export const DEFAULT_MAGNITUDE_FILTER_VALUE = 1

export const MAP_TYPE = {
  DARK: 'mapbox://styles/mapbox/dark-v11',
  '3D': 'mapbox://styles/mapbox/satellite-streets-v12',
  STREET: 'mapbox://styles/mapbox/streets-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  OUTDOOR: 'mapbox://styles/mapbox/outdoors-v12',
}

export const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY

export const MAP_UPDATE_MIN = 60

export const FIREBASE_CONFIG = {
  authDomain: 'tracking-earthquake.firebaseapp.com',
  projectId: 'tracking-earthquake',
  storageBucket: 'tracking-earthquake.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
}

export const FIREBASE_CUSTOM_POINTS_DB_NAME = 'custom-points'

export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm'
