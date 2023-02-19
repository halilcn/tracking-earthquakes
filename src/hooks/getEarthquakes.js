import { useSelector } from 'react-redux'
import { checkDate } from '../utils'

const getEarthquakes = () => {
  const { earthquakes, earthquakeTimeFilter } = useSelector(data => data.earthquake)

  return earthquakes.filter(earthquake => checkDate(earthquake.properties.date, -earthquakeTimeFilter))
}

export default getEarthquakes
