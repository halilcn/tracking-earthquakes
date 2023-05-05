import { useSelector } from 'react-redux'
import { isSelectedAnyArchiveItem } from '../store/earthquake'
import { checkDate } from '../utils'

const getEarthquakes = () => {
  const { earthquakes, earthquakeFilter } = useSelector(data => data.earthquake)
  const selectedArchiveDate = useSelector(isSelectedAnyArchiveItem)

  return earthquakes.filter(earthquake => {
    const dateFilter = checkDate(earthquake.properties.date, -earthquakeFilter.time)
    const magnitudeFilter = earthquake.properties.mag > earthquakeFilter.magnitude
    const depthFilter = earthquakeFilter.depth === -1 || earthquake.properties.depth < earthquakeFilter.depth

    return (selectedArchiveDate || dateFilter) && magnitudeFilter && depthFilter
  })
}

export default getEarthquakes
