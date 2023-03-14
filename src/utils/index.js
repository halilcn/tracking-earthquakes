import dayjs from 'dayjs'
import { INTENSITY_LEVELS, POINT_COLOR, POINT_SIZE } from '../constants'

export const getPointColorByIntensity = intensity => POINT_COLOR[getLevelByIntensity(intensity)]

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

// TODO: we need to have calculated healthy
export const calculateAffectedDistance = (mag, depth) => {
  const distance = Math.pow(10, 0.5 * mag + 1.44) * Math.pow(Math.E, 0.15 * depth)
  return distance / 150
}

export const prepareEarthquake = earthquake => {
  const {
    geojson: { coordinates },
    date,
    depth,
    earthquake_id,
    title,
    mag,
  } = earthquake

  const isNewEarthquake = checkIsNewEarthquake(date)
  const pointColor = getPointColorByIntensity(mag)
  const pointSize = getPointSizeByIntensity(mag)
  const affectedDistance = calculateAffectedDistance(mag, depth)
  const isActiveAffectedDistance = false

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
      title,
      mag,
      isNewEarthquake,
      pointColor,
      pointSize,
      affectedDistance,
      isActiveAffectedDistance,
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
