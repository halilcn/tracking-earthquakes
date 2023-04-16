import React, { useRef, useEffect, useMemo } from 'react'
import { MAP_TYPE, MAPBOX_API_KEY } from '../../constants'
import getEarthquakes from '../../hooks/getEarthquakes'
import { getPopupForCustomPoint, getPopupForPoint, prepareEarthquakeDistance, wrapperForSourceData } from '../../utils'
import { getMapType } from '../../utils/localStorageActions'
import UpdateTimer from './update-timer'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions } from '../../store/earthquake'
import FilterList from './filter-list'
import ActionList from './action-list'

import './index.scss'

const EARTHQUAKE_DATA = 'earthquakes-data'
const EARTHQUAKE_CUSTOM_POINTS_DATA = 'earthquakes-custom-points-data'
const EARTHQUAKE_AFFECTED_DISTANCE_DATA = 'earthquakes-affected-distance-data'
const EARTHQUAKE_CUSTOM_POINTS_LAYER = 'earthquakes-data-custom-points-layer'
const EARTHQUAKE_DATA_CIRCLE_LAYER = 'earthquakes-data-circle-layer'
const EARTHQUAKE_DATA_PULSING_LAYER = 'earthquakes-data-pulsing-layer'
const EARTHQUAKE_DATA_AFFECTED_DISTANCE_LAYER = 'earthquakes-data-affected-distance-layer'

const TrackingMap = () => {
  const dispatch = useDispatch()
  const isActiveCustomPointSelection = useSelector(state => state.earthquake.isActiveCustomPointSelection)
  const customPoints = useSelector(state => state.earthquake.customPoints)
  const earthquakeAffectedDistance = useSelector(state => state.earthquake.earthquakeAffectedDistance)

  const mapType = MAP_TYPE[getMapType()] || MAP_TYPE.DARK
  const earthquakes = getEarthquakes()

  const mapContainer = useRef(null)
  const map = useRef(null)
  const customPointMarker = useRef(null)

  const handleEarthquakeDistance = properties => {
    const earthquakeAffectedDistance = prepareEarthquakeDistance(properties)
    dispatch(earthquakeActions.setEarthquakeAffectedDistance(earthquakeAffectedDistance))
  }

  const clearEarthquakeDistance = () => dispatch(earthquakeActions.setEarthquakeAffectedDistance({}))

  useEffect(() => {
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_API_KEY
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapType,
      zoom: 2.5,
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
      map.current.addSource(EARTHQUAKE_AFFECTED_DISTANCE_DATA, { type: 'geojson', data: wrapperForSourceData(earthquakeAffectedDistance) })
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

      map.current.addLayer({
        id: EARTHQUAKE_DATA_AFFECTED_DISTANCE_LAYER,
        source: EARTHQUAKE_AFFECTED_DISTANCE_DATA,
        type: 'fill',
        layout: {},
        paint: {
          'fill-color': '#D0E0F1',
          'fill-opacity': 0.3,
        },
      })

      map.current.on('click', EARTHQUAKE_DATA_CIRCLE_LAYER, e => {
        e.preventDefault()
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForPoint(e.features[0].properties)).addTo(map.current)
        handleEarthquakeDistance(e.features[0].properties)
      })

      map.current.on('click', EARTHQUAKE_CUSTOM_POINTS_LAYER, e => {
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(getPopupForCustomPoint(e.features[0].properties)).addTo(map.current)
      })

      map.current.on('click', e => {
        if (e.defaultPrevented === false) clearEarthquakeDistance()
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
    map.current.getSource(EARTHQUAKE_AFFECTED_DISTANCE_DATA)?.setData(wrapperForSourceData([earthquakeAffectedDistance])) // We need to set as an array
  }, [earthquakeAffectedDistance])

  useEffect(() => {
    map.current.getSource(EARTHQUAKE_CUSTOM_POINTS_DATA)?.setData(wrapperForSourceData(customPoints))
  }, [customPoints])

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
