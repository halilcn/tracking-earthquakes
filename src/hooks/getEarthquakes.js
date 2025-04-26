import { useSelector } from 'react-redux'

import { SOURCES } from '../constants'
import { isSelectedAnyArchiveItem } from '../store/earthquake'
import { checkDate } from '../utils'

// Defining the rectangle boundaries for Turkey
const turkeyBoundaryCoordinates = {
  topLeft: [17.79521, 42.907104],
  topRight: [45.083146, 42.383737],
  bottomRight: [45.199218, 35.14297],
  bottomLeft: [19.257962, 36.158941],
}

const isInsideSpecialCoordinates = (coordinates, boundaries) => {
  const [longitude, latitude] = coordinates

  // Define min and max values for the rectangle
  const minLat = Math.min(boundaries.topLeft[1], boundaries.topRight[1], boundaries.bottomRight[1], boundaries.bottomLeft[1])
  const maxLat = Math.max(boundaries.topLeft[1], boundaries.topRight[1], boundaries.bottomRight[1], boundaries.bottomLeft[1])
  const minLng = Math.min(boundaries.topLeft[0], boundaries.topRight[0], boundaries.bottomRight[0], boundaries.bottomLeft[0])
  const maxLng = Math.max(boundaries.topLeft[0], boundaries.topRight[0], boundaries.bottomRight[0], boundaries.bottomLeft[0])

  // Check if point is inside the special coordinates
  return latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng
}

const getEarthquakes = () => {
  const { earthquakes, earthquakeFilter, animation } = useSelector(data => data.earthquake)
  const isAnimationActive = animation.currentDate
  const selectedArchiveDate = useSelector(isSelectedAnyArchiveItem)

  return earthquakes.filter(earthquake => {
    const dateFilter = checkDate(earthquake.properties.date, -earthquakeFilter.time)
    const magnitudeFilter = earthquake.properties.mag > earthquakeFilter.magnitude
    const depthFilter = earthquakeFilter.depth === -1 || earthquake.properties.depth < earthquakeFilter.depth

    // Check if earthquake is USGS and outside the the special regions.
    // Because of that, the USGS earthquakes include the whole world. We use special data for some regions.
    const sourceDataFilter =
      earthquake.properties.source !== SOURCES.USGS ||
      !isInsideSpecialCoordinates(earthquake.geometry.coordinates, turkeyBoundaryCoordinates)

    return (selectedArchiveDate || isAnimationActive || dateFilter) && magnitudeFilter && depthFilter && sourceDataFilter
  })
}

export default getEarthquakes
