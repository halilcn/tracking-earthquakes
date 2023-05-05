import { useSelector } from 'react-redux'
import { isSelectedAnyArchiveItem } from '../store/earthquake'
import { checkDate } from '../utils'

const getEarthquakes = () => {
  const { earthquakes, earthquakeTimeFilter, earthquakeMagnitudeFilter, earthquakeDepthFilter } = useSelector(data => data.earthquake)
  const selectedArchiveDate = useSelector(isSelectedAnyArchiveItem)

  return earthquakes.filter(earthquake => {
    const dateFilter = checkDate(earthquake.properties.date, -earthquakeTimeFilter)
    const magnitudeFilter = earthquake.properties.mag > earthquakeMagnitudeFilter
    const depthFilter = earthquakeDepthFilter === -1 || earthquake.properties.depth < earthquakeDepthFilter

    return (selectedArchiveDate || dateFilter) && magnitudeFilter && depthFilter
  })
}

export default getEarthquakes
