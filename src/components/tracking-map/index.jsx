import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'

import faultLines from '../../assets/static-data/fault-lines.json'
import populationPoints from '../../assets/static-data/population-points.json'
import {
  MAPBOX_API_KEY,
  MAPBOX_SOURCES,
  MAP_DEFAULT_COORDINATES,
  MAP_DEFAULT_ZOOM,
  MAP_TYPE,
  SOURCE_COLOR_DISABLE_VALUE,
  SOURCE_COLOR_ENABLE_VALUE,
} from '../../constants'
import constantsTestid from '../../constants/testid'
import getEarthquakes from '../../hooks/getEarthquakes'
import useSafeEffect from '../../hooks/useSafeEffect'
import { earthquakeActions } from '../../store/earthquake'
import {
  changeURL,
  debounce,
  getPopupForCustomPoint,
  getPopupForFaultLine,
  prepareEarthquakeDistance,
  wrapperForSourceData,
} from '../../utils'
import { getMapType } from '../../utils/localStorageActions'
import {
  deleteEarthquakeIDQueryParam,
  getEarthquakeIDQueryParam,
  getLatLongQueryParam,
  setEarthquakeIDQueryParam,
  setLatLongQueryParam,
} from '../../utils/queryParamsActions'
import ActionList from './action-list'
import FilterList from './filter-list'
import './index.scss'
import MapEarthquakePopup from './map-popups/map-earthquake-popup'
import UpdateTimer from './update-timer'

const TrackingMap = () => {
  const testid = constantsTestid.trackingMap
  const dispatch = useDispatch()
  const { isActiveCustomPointSelection, customPoints, earthquakeAffectedDistance, settings } = useSelector(state => {
    const { isActiveCustomPointSelection, customPoints, earthquakeAffectedDistance, settings } = state.earthquake
    return {
      isActiveCustomPointSelection,
      customPoints,
      earthquakeAffectedDistance,
      settings,
    }
  })

  const mapType = MAP_TYPE[getMapType()] || MAP_TYPE.DARK
  const queryLatLong = getLatLongQueryParam()
  const earthquakes = getEarthquakes()

  const mapContainer = useRef(null)
  const map = useRef(null)
  const customPointMarker = useRef(null)
  const selectedFaultLineIndex = useRef(null)

  const handleEarthquakeDistance = properties => {
    const earthquakeAffectedDistance = prepareEarthquakeDistance(properties)
    dispatch(earthquakeActions.setEarthquakeAffectedDistance(earthquakeAffectedDistance))
  }

  const clearEarthquakeDistance = () => dispatch(earthquakeActions.setEarthquakeAffectedDistance({}))

  const getCenterOfMap = () => {
    if (queryLatLong) return queryLatLong
    return MAP_DEFAULT_COORDINATES
  }

  const getZoomOfMap = () => {
    if (queryLatLong && queryLatLong.length === 3) return queryLatLong[2]
    return MAP_DEFAULT_ZOOM
  }

  const handleClickEarthquakePoint = earthquake => {
    const newEarthquake = {
      ...earthquake,
      coordinates: typeof earthquake.coordinates === 'string' ? JSON.parse(earthquake.coordinates) : earthquake.coordinates,
    }
    const earthquakePopupContainer = document.createElement('div')
    ReactDOM.render(<MapEarthquakePopup earthquake={newEarthquake} />, earthquakePopupContainer)
    new mapboxgl.Popup().setLngLat(newEarthquake.coordinates).setDOMContent(earthquakePopupContainer).addTo(map.current)

    handleEarthquakeDistance(newEarthquake)

    const url = setEarthquakeIDQueryParam(newEarthquake.earthquake_id)
    changeURL(url)
  }

  const initialMapbox = useCallback(() => {
    mapboxgl.accessToken = MAPBOX_API_KEY
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapType,
      zoom: getZoomOfMap(),
      center: getCenterOfMap(),
    })

    dispatch(earthquakeActions.setMapCurrent(map.current))
  })

  const handleMapboxActions = () => {
    map.current.on('click', MAPBOX_SOURCES.LAYER_DATA_CIRCLE, e => {
      e.preventDefault()
      handleClickEarthquakePoint(e.features[0].properties)
    })

    map.current.on('click', MAPBOX_SOURCES.LAYER_CUSTOM_POINTS, e => {
      new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForCustomPoint(e.features[0].properties)).addTo(map.current)
    })

    map.current.on('click', MAPBOX_SOURCES.LAYER_FAULT_LINE, e => {
      e.preventDefault()
      const { id, properties } = e.features[0]

      map.current.setFeatureState({ source: MAPBOX_SOURCES.DATA_FAULT_LINE, id }, { selected: true })
      selectedFaultLineIndex.current = id
      new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForFaultLine(properties)).addTo(map.current)
    })

    map.current.on('click', e => {
      if (e.defaultPrevented === false) {
        // TODO:
        clearEarthquakeDistance()

        const url = deleteEarthquakeIDQueryParam()
        changeURL(url)

        if (selectedFaultLineIndex.current) {
          map.current.setFeatureState({ source: MAPBOX_SOURCES.DATA_FAULT_LINE, id: selectedFaultLineIndex.current }, { selected: false })
          selectedFaultLineIndex.current = null
        }
      }
    })

    map.current.on(
      'move',
      debounce(() => {
        const url = setLatLongQueryParam([
          map.current.getCenter().lng.toFixed(2),
          map.current.getCenter().lat.toFixed(2),
          map.current.getZoom().toFixed(2),
        ])
        changeURL(url)
      }, 300)
    )
  }

  const handleMapboxData = () => {
    map.current.addSource(MAPBOX_SOURCES.DATA_EARTHQUAKES, { type: 'geojson', data: wrapperForSourceData(earthquakes) })
    map.current.addSource(MAPBOX_SOURCES.DATA_AFFECTED_DISTANCE, {
      type: 'geojson',
      data: wrapperForSourceData(earthquakeAffectedDistance),
    })
    map.current.addSource(MAPBOX_SOURCES.DATA_CUSTOM_POINTS, { type: 'geojson', data: wrapperForSourceData(customPoints) })
    map.current.addSource(MAPBOX_SOURCES.DATA_FAULT_LINE, {
      type: 'geojson',
      data: settings.isEnabledFaultLine ? faultLines : { type: 'FeatureCollection', features: [] },
    })
    map.current.addSource(MAPBOX_SOURCES.DATA_POPULATION_DENSITY, {
      type: 'geojson',
      data: wrapperForSourceData(settings.isEnabledPopulationDensity ? populationPoints : []),
    })

    map.current.addLayer({
      id: MAPBOX_SOURCES.LAYER_DATA_CIRCLE,
      source: MAPBOX_SOURCES.DATA_EARTHQUAKES,
      type: 'circle',
      paint: {
        'circle-radius': ['get', 'pointSize'],
        'circle-color': ['get', 'pointColor'],
        'circle-stroke-width': settings.isEnabledSourceColor ? SOURCE_COLOR_ENABLE_VALUE : SOURCE_COLOR_DISABLE_VALUE,
        'circle-stroke-color': ['get', 'sourceColor'],
      },
      filter: ['==', '$type', 'Point'],
    })

    map.current.addLayer({
      id: MAPBOX_SOURCES.LAYER_CUSTOM_POINTS,
      source: MAPBOX_SOURCES.DATA_CUSTOM_POINTS,
      type: 'symbol',
      layout: {
        'icon-image': 'location-icon',
        'icon-size': 0.7,
      },
      filter: ['==', '$type', 'Point'],
    })

    map.current.addLayer({
      id: MAPBOX_SOURCES.LAYER_DATA_PULSING,
      source: MAPBOX_SOURCES.DATA_EARTHQUAKES,
      type: 'symbol',
      filter: ['all', ['==', 'isNewEarthquake', true]],
      layout: {
        'icon-image': 'pulsing-dot',
      },
    })

    map.current.addLayer({
      id: MAPBOX_SOURCES.LAYER_DATA_AFFECTED_DISTANCE,
      source: MAPBOX_SOURCES.DATA_AFFECTED_DISTANCE,
      type: 'fill',
      layout: {},
      paint: {
        'fill-color': '#D0E0F1',
        'fill-opacity': 0.3,
      },
    })

    map.current.addLayer({
      id: MAPBOX_SOURCES.LAYER_FAULT_LINE,
      source: MAPBOX_SOURCES.DATA_FAULT_LINE,
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#4d4dff', '#e62e00'],
        'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 10, 7],
        'line-opacity': 0.7,
      },
    })

    map.current.addLayer({
      id: MAPBOX_SOURCES.LAYER_POPULATION_DENSITY,
      source: MAPBOX_SOURCES.DATA_POPULATION_DENSITY,
      type: 'heatmap',
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': 0.9,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(236,222,239,0)',
          0.2,
          'rgb(208,209,230)',
          0.4,
          'rgb(166,189,219)',
          0.6,
          'rgb(103,169,207)',
          0.8,
          'rgb(28,144,153)',
        ],
        'heatmap-radius': 20,
        'heatmap-opacity': 0.3,
      },
    })
  }

  const handleMapbox = useCallback(() => {
    const size = 150
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      onAdd: function () {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d', { willReadFrequently: true })
      },
      render: function () {
        const duration = 1000
        const t = (performance.now() % duration) / duration

        const radius = (size / 2) * 0.3
        const outerRadius = (size / 2) * 0.7 * t + radius
        const context = this.context

        context.clearRect(0, 0, this.width, this.height)
        context.beginPath()
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`
        context.fill()

        context.beginPath()
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
        context.strokeStyle = 'white'
        context.lineWidth = 2 + 4 * (1 - t)
        context.fill()
        context.stroke()

        this.data = context.getImageData(0, 0, this.width, this.height).data

        map.current.triggerRepaint()

        return true
      },
    }

    map.current.on('load', () => {
      map.current.resize()
      map.current.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })
      map.current.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
        if (error) throw error
        map.current.addImage('location-icon', image)
      })

      handleMapboxData()
      handleMapboxActions()
    })
  }, [])

  const enableEarthquakePointPopup = () => {
    const earthquakeID = getEarthquakeIDQueryParam()
    if (!earthquakeID) return

    const earthquakeProperties = earthquakes.find(earthquake => earthquake.properties.earthquake_id == earthquakeID)?.properties
    if (!earthquakeProperties) return

    handleClickEarthquakePoint(earthquakeProperties)
  }

  useSafeEffect(() => {
    initialMapbox()
    handleMapbox()
    enableEarthquakePointPopup()
  }, [])

  useEffect(() => {
    if (!isActiveCustomPointSelection) {
      customPointMarker.current?.remove()
      customPointMarker.current = null
      return
    }

    customPointMarker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([35.1942, 39.245])
      .addTo(map.current)

    customPointMarker.current.on('dragend', () => {
      dispatch(earthquakeActions.setCustomPointCoordinates(customPointMarker.current.getLngLat()))
    })
  }, [isActiveCustomPointSelection])

  useEffect(() => {
    map.current.getSource(MAPBOX_SOURCES.DATA_EARTHQUAKES)?.setData(wrapperForSourceData(earthquakes))
  }, [earthquakes])

  useEffect(() => {
    map.current.getSource(MAPBOX_SOURCES.DATA_AFFECTED_DISTANCE)?.setData(wrapperForSourceData([earthquakeAffectedDistance])) // We need to set as an array
  }, [earthquakeAffectedDistance])

  useEffect(() => {
    map.current.getSource(MAPBOX_SOURCES.DATA_CUSTOM_POINTS)?.setData(wrapperForSourceData(customPoints))
  }, [customPoints])

  useEffect(() => {
    const currentData = settings.isEnabledFaultLine ? faultLines : { type: 'FeatureCollection', features: [] }
    map.current.getSource(MAPBOX_SOURCES.DATA_FAULT_LINE)?.setData(currentData)
  }, [settings.isEnabledFaultLine])

  useEffect(() => {
    const currentData = wrapperForSourceData(settings.isEnabledPopulationDensity ? populationPoints : [])
    map.current.getSource(MAPBOX_SOURCES.DATA_POPULATION_DENSITY)?.setData(currentData)
  }, [settings.isEnabledPopulationDensity])

  const memoizedComponents = useMemo(() => {
    return (
      <>
        <ActionList />
        <UpdateTimer />
        <FilterList />
      </>
    )
  }, [])

  return (
    <div data-testid={testid.mapContainer} className="tracking-map">
      <div className="tracking-map__map-container" ref={mapContainer} />
      {memoizedComponents}
    </div>
  )
}

export default TrackingMap
