import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { MAPBOX_API_KEY } from '../../constants'
import './index.scss'

const Search = () => {
  const mapCurrent = useSelector(state => state.earthquake.mapCurrent)

  const setMapboxSearch = () => {
    const searchInput = document.getElementById('search-input')
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_API_KEY,
      placeholder: 'Bir yer ara...',
      mapboxgl: mapboxgl,
      marker: false,
    })

    if (searchInput.childNodes.length === 0 && mapCurrent) {
      searchInput.appendChild(geocoder.onAdd(mapCurrent))
    }
  }

  useEffect(() => {
    setMapboxSearch()
  }, [])

  // TODO: we have to find better solution..
  useEffect(() => {
    setMapboxSearch()
  }, [mapCurrent])

  return (
    <div className="search">
      <div id="search-input" />
    </div>
  )
}

export default Search
