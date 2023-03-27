import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { DEFAULT_TIME_FORMAT, INTENSITY_LEVELS, POINT_COLOR, POINT_SIZE } from '../constants'

dayjs.extend(customParseFormat)

export const getPointColorByIntensity = intensity => POINT_COLOR[getLevelByIntensity(intensity)]

export const getPointSizeByIntensity = intensity => POINT_SIZE[getLevelByIntensity(intensity)]

export const checkIsNewEarthquake = date => dayjs().add(-15, 'minutes').isBefore(dayjs(date))

export const checkDate = (date, filterTime) => dayjs().add(filterTime, 'hours').isBefore(dayjs(date, DEFAULT_TIME_FORMAT))

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

export const prepareEarthquake = earthquake => {
  const {
    geojson: { coordinates },
    date,
    depth,
    earthquake_id,
    title,
    mag,
    location_properties,
  } = earthquake

  const isNewEarthquake = checkIsNewEarthquake(date)
  const pointColor = getPointColorByIntensity(mag)
  const pointSize = getPointSizeByIntensity(mag)

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates,
    },
    properties: {
      coordinates,
      date,
      depth,
      earthquake_id,
      location_properties,
      title,
      mag,
      isNewEarthquake,
      pointColor,
      pointSize,
    },
  }
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

export const getPopupForPoint = earthquake => `
<div><b>Büyüklük:</b> ${earthquake.mag}</div>
<div><b>Derinlik:</b> ${earthquake.depth} km</div>
<div><b>Tarih:</b> ${earthquake.date}</div>
<div><b>Adres:</b> ${earthquake.title}</div>`

export const getPopupForCustomPoint = customPoint => `
<div><b>Oluşturan Kişi:</b> ${customPoint.username}</div>
<div><b>Açıklama:</b> ${customPoint.description}</div>
`
// TODO: refactor
export const calculateDistanceByUsingKm = (center, radiusInKm, points) => {
  if (!points) points = 64

  const [longitude, latitude] = center
  var km = radiusInKm

  const ret = []
  const distanceX = km / (111.32 * Math.cos((latitude * Math.PI) / 180))
  const distanceY = km / 110.574

  let theta, x, y
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI)
    x = distanceX * Math.cos(theta)
    y = distanceY * Math.sin(theta)

    ret.push([longitude + x, latitude + y])
  }
  ret.push(ret[0])

  return ret
}

export const prepareEarthquakeDistance = ({ coordinates, mag, depth }) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [calculateDistanceByUsingKm(JSON.parse(coordinates), calculateAffectedDistance(mag, depth))],
    },
  }
}
