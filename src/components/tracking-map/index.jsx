import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import { MAP_TYPE, MAPBOX_API_KEY } from '../../constants'
import getEarthquakes from '../../hooks/getEarthquakes'
import {
  getPopupForCustomPoint,
  getPopupForFaultLine,
  getPopupForPoint,
  prepareEarthquakeDistance,
  wrapperForSourceData,
} from '../../utils'
import { getMapType } from '../../utils/localStorageActions'
import UpdateTimer from './update-timer'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions } from '../../store/earthquake'
import FilterList from './filter-list'
import ActionList from './action-list'
import faultLines from '../../assets/static-data/fault-lines.json'

import './index.scss'

const SOURCE = {
  DATA_EARTHQUAKES: 'data-earthquakes',
  DATA_CUSTOM_POINTS: 'data-earthquakes-custom-points',
  DATA_AFFECTED_DISTANCE: 'data-earthquakes-affected-distance',
  DATA_FAULT_LINE: 'data-fault-line',
  LAYER_CUSTOM_POINTS: 'layer-earthquakes-custom-points',
  LAYER_DATA_CIRCLE: 'data-earthquakes-circle-layer',
  LAYER_DATA_PULSING: 'layer-earthquakes-pulsing',
  LAYER_DATA_AFFECTED_DISTANCE: 'layer-earthquakes-affected-distance',
  LAYER_FAULT_LINE: 'layer-fault-line',
}

const TrackingMap = () => {
  const dispatch = useDispatch()
  const { isActiveCustomPointSelection, customPoints, earthquakeAffectedDistance, faultLineActive } = useSelector(state => {
    const { isActiveCustomPointSelection, customPoints, earthquakeAffectedDistance, faultLineActive } = state.earthquake
    return { isActiveCustomPointSelection, customPoints, earthquakeAffectedDistance, faultLineActive }
  })

  const mapType = MAP_TYPE[getMapType()] || MAP_TYPE.DARK
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

  const initialMapbox = useCallback(() => {
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_API_KEY
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapType,
      zoom: 2.5,
      center: [35.163262, 39.431293],
    })

    dispatch(earthquakeActions.setMapCurrent(map.current))
  })

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
        this.context = canvas.getContext('2d')
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

      map.current.addSource(SOURCE.DATA_EARTHQUAKES, { type: 'geojson', data: wrapperForSourceData(earthquakes) })
      map.current.addSource(SOURCE.DATA_AFFECTED_DISTANCE, { type: 'geojson', data: wrapperForSourceData(earthquakeAffectedDistance) })
      map.current.addSource(SOURCE.DATA_CUSTOM_POINTS, { type: 'geojson', data: wrapperForSourceData(customPoints) })
      map.current.addSource(SOURCE.DATA_FAULT_LINE, {
        type: 'geojson',
        data: faultLineActive ? faultLines : { type: 'FeatureCollection', features: [] },
      })

      map.current.addLayer({
        id: SOURCE.LAYER_DATA_CIRCLE,
        source: SOURCE.DATA_EARTHQUAKES,
        type: 'circle',
        paint: {
          'circle-radius': ['get', 'pointSize'],
          'circle-color': ['get', 'pointColor'],
        },
        filter: ['==', '$type', 'Point'],
      })

      map.current.addLayer({
        id: SOURCE.LAYER_CUSTOM_POINTS,
        source: SOURCE.DATA_CUSTOM_POINTS,
        type: 'symbol',
        layout: {
          'icon-image': 'location-icon',
          'icon-size': 0.7,
        },
        filter: ['==', '$type', 'Point'],
      })

      map.current.addLayer({
        id: SOURCE.LAYER_DATA_PULSING,
        source: SOURCE.DATA_EARTHQUAKES,
        type: 'symbol',
        filter: ['all', ['==', 'isNewEarthquake', true]],
        layout: {
          'icon-image': 'pulsing-dot',
        },
      })

      map.current.addLayer({
        id: SOURCE.LAYER_DATA_AFFECTED_DISTANCE,
        source: SOURCE.DATA_AFFECTED_DISTANCE,
        type: 'fill',
        layout: {},
        paint: {
          'fill-color': '#D0E0F1',
          'fill-opacity': 0.3,
        },
      })

      map.current.addLayer({
        id: SOURCE.LAYER_FAULT_LINE,
        source: SOURCE.DATA_FAULT_LINE,
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

      map.current.on('click', SOURCE.LAYER_DATA_CIRCLE, e => {
        e.preventDefault()
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForPoint(e.features[0].properties)).addTo(map.current)
        handleEarthquakeDistance(e.features[0].properties)
      })

      map.current.on('click', SOURCE.LAYER_CUSTOM_POINTS, e => {
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForCustomPoint(e.features[0].properties)).addTo(map.current)
      })

      map.current.on('click', e => {
        if (e.defaultPrevented === false) clearEarthquakeDistance()
      })

      map.current.on('click', SOURCE.LAYER_FAULT_LINE, e => {
        e.preventDefault()
        const { id, properties } = e.features[0]

        map.current.setFeatureState({ source: SOURCE.DATA_FAULT_LINE, id }, { selected: true })
        selectedFaultLineIndex.current = id
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForFaultLine(properties)).addTo(map.current)
      })

      map.current.on('click', e => {
        if (e.defaultPrevented === false && selectedFaultLineIndex.current) {
          map.current.setFeatureState({ source: SOURCE.DATA_FAULT_LINE, id: selectedFaultLineIndex.current }, { selected: false })
          selectedFaultLineIndex.current = null
        }
      })
    })
  })

  useEffect(() => {
    initialMapbox()
    handleMapbox()
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
    map.current.getSource(SOURCE.DATA_EARTHQUAKES)?.setData(wrapperForSourceData(earthquakes))
  }, [earthquakes])

  useEffect(() => {
    map.current.getSource(SOURCE.DATA_AFFECTED_DISTANCE)?.setData(wrapperForSourceData([earthquakeAffectedDistance])) // We need to set as an array
  }, [earthquakeAffectedDistance])

  useEffect(() => {
    map.current.getSource(SOURCE.DATA_CUSTOM_POINTS)?.setData(wrapperForSourceData(customPoints))
  }, [customPoints])

  useEffect(() => {
    const currentData = faultLineActive ? faultLines : { type: 'FeatureCollection', features: [] }
    map.current.getSource(SOURCE.DATA_FAULT_LINE)?.setData(currentData)
  }, [faultLineActive])

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
    <div className="tracking-map">
      <div className="tracking-map__map-container" ref={mapContainer} />
      {memoizedComponents}
    </div>
  )
}

export default TrackingMap
