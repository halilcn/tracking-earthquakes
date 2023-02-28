import { useSelector } from 'react-redux'
import { checkDate } from '../utils'

const getEarthquakes = () => {
  const { earthquakes, earthquakeTimeFilter, earthquakeMagnitudeFilter } = useSelector(data => data.earthquake)

  return earthquakes
    .filter(earthquake => checkDate(earthquake.properties.date, -earthquakeTimeFilter))
    .filter(earthquake => earthquake.properties.mag > earthquakeMagnitudeFilter)
}

export default getEarthquakes
