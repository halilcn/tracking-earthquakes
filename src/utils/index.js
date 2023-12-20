import { DEFAULT_API_DATE_FORMAT, INTENSITY_LEVELS, POINT_COLOR, POINT_SIZE, SOURCES, SOURCE_COLOR } from '../constants'
import i18n from '../i18n'
import dayjs from './dayjs'
import { getLanguage } from './localStorageActions'

export const getCurrentLanguage = () => getLanguage() || navigator.language || navigator.userLanguage

export const getPointColorByIntensity = intensity => POINT_COLOR[getLevelByIntensity(intensity)]

export const getSourceColorBySource = source => SOURCE_COLOR[source]

export const getPointSizeByIntensity = intensity => POINT_SIZE[getLevelByIntensity(intensity)]

export const checkIsNewEarthquake = date => dayjs().add(-15, 'minutes').isBefore(dayjs(date))

export const checkDate = (date, filterTime) => dayjs().add(filterTime, 'hours').isBefore(dayjs(date))

export const getLevelByIntensity = intensity => {
  if (intensity < 3) return INTENSITY_LEVELS.LEVEL_1
  if (intensity >= 3 && intensity < 4) return INTENSITY_LEVELS.LEVEL_2
  if (intensity >= 4 && intensity < 5) return INTENSITY_LEVELS.LEVEL_3
  if (intensity >= 5 && intensity < 6) return INTENSITY_LEVELS.LEVEL_4
  if (intensity >= 6 && intensity < 7) return INTENSITY_LEVELS.LEVEL_5
  if (intensity >= 7) return INTENSITY_LEVELS.LEVEL_6
}

export const calculateAffectedDistance = (mag, depth) => {
  const intensity = mag - 1.5
  const distance = Math.pow(10, (1.8 * intensity + 9.1 - 0.9 * depth) / 3)
  return distance / 15
}

export const earthquakeDataStructure = earthquake => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: earthquake.coordinates,
  },
  properties: {
    location_properties: {
      epiCenter: {
        name: 'Unknown City',
      },
    },
    source: 'unknown',
    ...earthquake,
  },
})

export const prepareEarthquakeKandilli = earthquake => {
  const {
    geojson: { coordinates },
    date,
    depth,
    earthquake_id,
    title,
    mag,
    location_properties,
  } = earthquake

  const source = SOURCES.KANDILLI
  const isNewEarthquake = checkIsNewEarthquake(date)
  const pointColor = getPointColorByIntensity(mag)
  const pointSize = getPointSizeByIntensity(mag)
  const convertedDate = dayjs(date, 'YYYY.MM.DD hh:mm:ss').format()
  const sourceColor = getSourceColorBySource(source)

  return earthquakeDataStructure({
    depth: depth.toFixed(2),
    mag: mag.toFixed(1),
    title: title.trim().toLowerCase(),
    date: convertedDate,
    source,
    sourceColor,
    coordinates,
    earthquake_id,
    location_properties,
    isNewEarthquake,
    pointColor,
    pointSize,
  })
}

export const prepareEarthquakeUsgs = earthquake => {
  const {
    id,
    geometry: { coordinates },
    properties,
  } = earthquake

  const source = SOURCES.USGS
  const date = dayjs(properties.time).format()
  const mag = properties.mag.toFixed(1)
  const isNewEarthquake = checkIsNewEarthquake(date)
  const pointColor = getPointColorByIntensity(mag)
  const pointSize = getPointSizeByIntensity(mag)
  const sourceColor = getSourceColorBySource(source)

  return earthquakeDataStructure({
    depth: coordinates[coordinates.length - 1].toFixed(2),
    earthquake_id: id,
    title: properties.title.trim().toLowerCase(),
    location_properties: {
      epiCenter: {
        name: properties.title,
      },
    },
    source,
    sourceColor,
    date,
    mag,
    coordinates,
    isNewEarthquake,
    pointColor,
    pointSize,
  })
}

export const prepareCustomPoint = params => {
  const { coordinates, ...otherParams } = params
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates },
    properties: {
      coordinates,
      ...otherParams,
    },
  }
}

export const wrapperForSourceData = earthquakes => ({ type: 'FeatureCollection', features: earthquakes })

export const getPopupForCustomPoint = customPoint => `
<div><b>Oluşturan Kişi:</b> ${customPoint.username}</div>
<div><b>Açıklama:</b> ${customPoint.description}</div>
`

export const getPopupForFaultLine = faultLine => `
<div><b>${i18n.t('Layer')}:</b> ${faultLine.LAYER}</div>
<div><b>${i18n.t('Name')}:</b> ${faultLine.Name}</div>
<div><b>${i18n.t('Plate A')}:</b> ${faultLine.PlateA}</div>
<div><b>${i18n.t('Plate B')}:</b> ${faultLine.PlateB}</div>
<div><b>${i18n.t('Source')}:</b> ${faultLine.Source}</div>
`

export const calculateDistanceByUsingKm = (center, radiusInKm, points) => {
  const currentPoints = points || 64
  const [longitude, latitude] = center
  const distanceX = radiusInKm / (111.32 * Math.cos((latitude * Math.PI) / 180))
  const distanceY = radiusInKm / 110.574

  const ret = Array(currentPoints)
    .fill(0)
    .map((_, i) => {
      const theta = (i / currentPoints) * (2 * Math.PI)
      const x = distanceX * Math.cos(theta)
      const y = distanceY * Math.sin(theta)

      return [longitude + x, latitude + y]
    })
  ret.push(ret[0])

  return ret
}

export const prepareEarthquakeDistance = ({ coordinates, mag, depth }) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [calculateDistanceByUsingKm(coordinates, calculateAffectedDistance(mag, depth))],
    },
  }
}

export const isMobile = () => window.innerWidth < 1100

export const convertDateFormatForAPI = date => date.format(DEFAULT_API_DATE_FORMAT)

export const debounce = (func, delay) => {
  let inDebounce = null
  return (...args) => {
    if (inDebounce) clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func(...args), delay)
  }
}

export const changeURL = url => {
  history.pushState({}, '', url)
}

export const copyText = text => navigator.clipboard.writeText(text)
