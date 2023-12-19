import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'

const useMapboxPopup = () => {
  const mapCurrentRef = useRef(null)

  const _mapCurrent = useSelector(state => state.earthquake.mapCurrent)

  useEffect(() => {
    mapCurrentRef.current = _mapCurrent
  }, [_mapCurrent])

  const enableMapboxPopup = payload => {
    const { coordinates, popupContent: _popupContent } = payload

    const popupContent =
      typeof _popupContent === 'string'
        ? React.createElement('div', {}, <div dangerouslySetInnerHTML={{ __html: _popupContent }} />)
        : _popupContent

    const popupContainer = document.createElement('div')
    ReactDOM.render(popupContent, popupContainer)
    console.log('mapCurrentRef.current', mapCurrentRef.current);
    new mapboxgl.Popup().setLngLat(coordinates).setDOMContent(popupContainer).addTo(mapCurrentRef.current)
  }

  const disableAllMapboxPopup = () => {
    const popups = document.querySelectorAll('.mapboxgl-popup')
    if (!popups.length) return

    for (const popup of popups) {
      popup.remove()
    }
  }

  return {
    enableMapboxPopup,
    disableAllMapboxPopup,
  }
}

export default useMapboxPopup
