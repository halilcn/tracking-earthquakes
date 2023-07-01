import { useEffect } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { MAPBOX_API_KEY } from '../../constants'
import constantsTestId from '../../constants/testid'
import './index.scss'

const Search = () => {
  const testid = constantsTestId.search
  const { t } = useTranslation()
  const mapCurrent = useSelector(state => state.earthquake.mapCurrent)

  const setMapboxSearch = () => {
    const searchInput = document.getElementById('search-input')
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_API_KEY,
      placeholder: `${t('Search a place')}...`,
      mapboxgl: mapboxgl,
      marker: false,
    })

    if (searchInput.childNodes.length === 0 && mapCurrent) {
      searchInput.appendChild(geocoder.onAdd(mapCurrent))
    }
  }

  useEffect(() => {
    if (mapCurrent) setMapboxSearch()
  }, [mapCurrent])

  return (
    <div data-testid={testid.searchContainer} className="search">
      <div id="search-input" />
    </div>
  )
}

export default Search
