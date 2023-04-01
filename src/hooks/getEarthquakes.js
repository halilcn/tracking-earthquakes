import { useSelector } from 'react-redux'
import { isSelectedAnyArchiveItem } from '../store/earthquake'
import { checkDate } from '../utils'

const getEarthquakes = () => {
  const { earthquakes, earthquakeTimeFilter, earthquakeMagnitudeFilter } = useSelector(data => data.earthquake)
  const selectedArchiveDate = useSelector(isSelectedAnyArchiveItem)

  return earthquakes.filter(earthquake => {
    const dateFilter = checkDate(earthquake.properties.date, -earthquakeTimeFilter)
    const magnitudeFilter = earthquake.properties.mag > earthquakeMagnitudeFilter

    return (selectedArchiveDate || dateFilter) && magnitudeFilter
  })
}

export default getEarthquakes
