import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

// Ensure mapboxgl is imported if not globally available

// Constants for styling and keys
const LINE_COLOR = '#4287f5'
const LINE_WIDTH = 2
const ESCAPE_KEY = 'Escape'

// Helper function to generate unique IDs (if needed, Mapbox might handle this)
const generateUniqueId = () => `measurement-${window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`

// Haversine formula helpers
const toRad = value => (value * Math.PI) / 180

const getDistance = (point1, point2) => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(point2[1] - point1[1])
  const dLon = toRad(point2[0] - point1[0])
  const lat1 = toRad(point1[1])
  const lat2 = toRad(point2[1])

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const calculateTotalDistance = points => {
  let totalDistance = 0
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += getDistance(points[i], points[i + 1])
  }
  return totalDistance
}

// It was created by using Agent

const DistanceMeasurementTool = () => {
  const { mapCurrent } = useSelector(state => state.earthquake)

  const pointsRef = useRef([])
  const lineSourceIdRef = useRef(null)
  const lineLayerIdRef = useRef(null)
  const popupRef = useRef(null)
  const isMeasuringRef = useRef(false) // To track if measurement is active

  // --- Map Interaction Helpers ---

  const initializeMeasurement = () => {
    if (!mapCurrent || isMeasuringRef.current) return

    isMeasuringRef.current = true
    pointsRef.current = []
    lineSourceIdRef.current = generateUniqueId()
    lineLayerIdRef.current = generateUniqueId()

    mapCurrent.addSource(lineSourceIdRef.current, {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
    })

    mapCurrent.addLayer({
      id: lineLayerIdRef.current,
      type: 'line',
      source: lineSourceIdRef.current,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': LINE_COLOR,
        'line-width': LINE_WIDTH,
      },
    })

    // Add initial listeners
    mapCurrent.on('click', handleMapClick)
    mapCurrent.on('mousemove', handleMapMouseMove)
    window.addEventListener('keydown', handleKeyDown)
  }

  const updateLineData = coordinates => {
    if (!mapCurrent || !lineSourceIdRef.current) return
    const source = mapCurrent.getSource(lineSourceIdRef.current)
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      })
    }
  }

  const updatePopup = (coordinates, text) => {
    if (!mapCurrent) return

    if (popupRef.current) {
      popupRef.current.remove()
      popupRef.current = null
    }

    if (coordinates && text) {
      // Check if mapboxgl is available before creating Popup
      if (typeof mapboxgl !== 'undefined' && mapboxgl.Popup) {
        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          anchor: 'bottom', // Anchor popup nicely
        })
          .setLngLat(coordinates)
          .setHTML(`<div style="padding: 5px; font-size: 12px;">${text}</div>`) // Style popup
          .addTo(mapCurrent)
      } else {
        console.error("Mapbox GL JS 'Popup' is not available.")
      }
    }
  }

  const cleanupMeasurement = () => {
    if (!mapCurrent) return

    // Remove listeners first
    mapCurrent.off('click', handleMapClick)
    mapCurrent.off('mousemove', handleMapMouseMove)
    window.removeEventListener('keydown', handleKeyDown)

    // Remove map elements
    if (popupRef.current) {
      popupRef.current.remove()
      popupRef.current = null
    }
    if (lineLayerIdRef.current && mapCurrent.getLayer(lineLayerIdRef.current)) {
      mapCurrent.removeLayer(lineLayerIdRef.current)
    }
    if (lineSourceIdRef.current && mapCurrent.getSource(lineSourceIdRef.current)) {
      mapCurrent.removeSource(lineSourceIdRef.current)
    }

    // Reset refs
    pointsRef.current = []
    lineSourceIdRef.current = null
    lineLayerIdRef.current = null
    isMeasuringRef.current = false
  }

  // --- Event Handlers ---

  const handleMapClick = e => {
    if (!isMeasuringRef.current) return // Should not happen if listener is removed, but good practice

    const newPoint = [e.lngLat.lng, e.lngLat.lat]
    pointsRef.current = [...pointsRef.current, newPoint]

    // Update the permanent line with the new point
    updateLineData(pointsRef.current)

    // Update popup with total distance at the last clicked point
    const totalDistance = calculateTotalDistance(pointsRef.current)
    if (totalDistance > 0) {
      updatePopup(newPoint, `${totalDistance.toFixed(2)} km`)
    } else if (pointsRef.current.length === 1) {
      // Show popup at first point
      updatePopup(newPoint, '0.00 km')
    }
  }

  const handleMapMouseMove = e => {
    if (!isMeasuringRef.current || pointsRef.current.length === 0) {
      // If not measuring or no points yet, ensure popup is removed
      if (popupRef.current) {
        updatePopup(null, null) // Remove popup
      }
      return
    }

    const currentPos = [e.lngLat.lng, e.lngLat.lat]
    const tempPoints = [...pointsRef.current, currentPos]

    // Update the line visually to follow the cursor
    updateLineData(tempPoints)

    // Update popup with the distance to the cursor
    const totalDistance = calculateTotalDistance(tempPoints)
    updatePopup(currentPos, `${totalDistance.toFixed(2)} km`)
  }

  const handleKeyDown = e => {
    if (e.key === ESCAPE_KEY) {
      cleanupMeasurement()
      // Re-initialize the tool to allow starting a new measurement immediately
      initializeMeasurement()
    }
  }

  // --- Lifecycle Effect ---

  useEffect(() => {
    // Start measurement when the component mounts and map is ready
    // We might want a button to trigger this instead, but following original logic
    if (mapCurrent) {
      initializeMeasurement()
    }

    // Cleanup on unmount or when map changes
    return () => {
      if (isMeasuringRef.current) {
        // Only cleanup if measurement was active
        cleanupMeasurement()
      }
    }
    // Rerun effect if map instance changes
  }, [mapCurrent]) // Dependency array includes mapCurrent

  // This component does not render anything itself
  return null
}

export default DistanceMeasurementTool
