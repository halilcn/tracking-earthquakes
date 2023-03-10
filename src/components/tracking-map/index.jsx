import React, { useRef, useEffect } from 'react'
import { MAP_TYPE, MAPBOX_API_KEY } from '../../constants'
import getEarthquakes from '../../hooks/getEarthquakes'
import { getPopupForCustomPoint, getPopupForPoint, wrapperForSourceData } from '../../utils'
import { getMapType } from '../../utils/localStorageActions'
import UpdateTimer from './update-timer'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions } from '../../store/earthquake'
import FilterPanel from './filter-panel'

import './index.scss'

const EARTHQUAKE_DATA = 'earthquakes-data'
const EARTHQUAKE_CUSTOM_POINTS_DATA = 'earthquakes-custom-points-data'
const EARTHQUAKE_CUSTOM_POINTS_LAYER = 'earthquakes-data-custom-points-layer'
const EARTHQUAKE_DATA_CIRCLE_LAYER = 'earthquakes-data-circle-layer'
const EARTHQUAKE_DATA_PULSING_LAYER = 'earthquakes-data-pulsing-layer'

const TrackingMap = () => {
  const dispatch = useDispatch()
  const isActiveCustomPointSelection = useSelector(state => state.earthquake.isActiveCustomPointSelection)
  const customPoints = useSelector(state => state.earthquake.customPoints)

  const mapType = MAP_TYPE[getMapType()] || MAP_TYPE.DARK
  const earthquakes = getEarthquakes()

  const mapContainer = useRef(null)
  const map = useRef(null)
  const customPointMarker = useRef(null)

  useEffect(() => {
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_API_KEY
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapType,
      zoom: 5.4,
      center: [35.163262, 39.431293],
    })

    dispatch(earthquakeActions.setMapCurrent(map.current))
  }, [])

  useEffect(() => {
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

      map.current.addSource(EARTHQUAKE_DATA, { type: 'geojson', data: wrapperForSourceData(earthquakes) })
      map.current.addSource(EARTHQUAKE_CUSTOM_POINTS_DATA, { type: 'geojson', data: wrapperForSourceData(customPoints) })

      map.current.addLayer({
        id: EARTHQUAKE_DATA_CIRCLE_LAYER,
        source: EARTHQUAKE_DATA,
        type: 'circle',
        paint: {
          'circle-radius': ['get', 'pointSize'],
          'circle-color': ['get', 'pointColor'],
        },
        filter: ['==', '$type', 'Point'],
      })

      map.current.addLayer({
        id: EARTHQUAKE_CUSTOM_POINTS_LAYER,
        source: EARTHQUAKE_CUSTOM_POINTS_DATA,
        type: 'symbol',
        layout: {
          'icon-image': 'location-icon',
          'icon-size': 0.7,
        },
        filter: ['==', '$type', 'Point'],
      })

      map.current.addLayer({
        id: EARTHQUAKE_DATA_PULSING_LAYER,
        source: EARTHQUAKE_DATA,
        type: 'symbol',
        filter: ['all', ['==', 'isNewEarthquake', true]],
        layout: {
          'icon-image': 'pulsing-dot',
        },
      })

      map.current.on('click', EARTHQUAKE_DATA_CIRCLE_LAYER, e => {
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForPoint(e.features[0].properties)).addTo(map.current)
      })

      map.current.on('click', EARTHQUAKE_CUSTOM_POINTS_LAYER, e => {
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForCustomPoint(e.features[0].properties)).addTo(map.current)
      })
    })
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
    map.current.getSource(EARTHQUAKE_DATA)?.setData(wrapperForSourceData(earthquakes))
  }, [earthquakes])

  useEffect(() => {
    map.current.getSource(EARTHQUAKE_CUSTOM_POINTS_DATA)?.setData(wrapperForSourceData(customPoints))
  }, [customPoints])

  return (
    <div className="tracking-map">
      <div className="tracking-map__map-container" ref={mapContainer} />
      <UpdateTimer />
      <FilterPanel />
    </div>
  )
}

export default TrackingMap
