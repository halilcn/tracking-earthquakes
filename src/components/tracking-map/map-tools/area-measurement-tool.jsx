import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

// Assuming mapboxgl is globally available, otherwise import it

const generateUniqueId = () => {
  return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
}

// It was created by using Agent

const AreaMeasurementTool = () => {
  const { mapCurrent } = useSelector(state => state.earthquake)
  const [points, setPoints] = useState([])
  const [measurement, setMeasurement] = useState(null)
  const [firstPoint, setFirstPoint] = useState(null)
  const [isFinalized, setIsFinalized] = useState(false) // Track finalization state

  const popupRef = useRef(null)
  const currentPointsRef = useRef([])
  const markersRef = useRef([])
  // Use refs for stable source and layer IDs
  const sourceIdRef = useRef(`measurement-source-${generateUniqueId()}`)
  const layerIdRef = useRef(`measurement-layer-${generateUniqueId()}`)
  const lineLayerIdRef = useRef(`measurement-line-layer-${generateUniqueId()}`) // For outline

  // Function to update the GeoJSON source
  const updateDataSource = geometry => {
    if (!mapCurrent) return
    const source = mapCurrent.getSource(sourceIdRef.current)
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: geometry, // Can be null, Point, LineString, Polygon
      })
    }
  }

  // Function to calculate area and update state
  const calculateAndUpdateArea = polygonPoints => {
    if (polygonPoints.length < 4) {
      // Need at least 3 vertices + closing point
      setMeasurement(null)
      return 0
    }
    const polygon = turf.polygon([polygonPoints])
    const area = turf.area(polygon) / 1000000 // Convert to square kilometers
    setMeasurement(area)
    return area
  }

  // Function to show/update popup
  const updatePopup = (coordinates, text) => {
    if (!mapCurrent) return
    if (popupRef.current) {
      popupRef.current.remove()
    }
    popupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15, // Offset the popup slightly from the point
    })
      .setLngLat(coordinates)
      .setHTML(`<div style="padding: 5px;">${text}</div>`)
      .addTo(mapCurrent)
  }

  // Function to hide the popup
  const hidePopup = () => {
    if (popupRef.current) {
      popupRef.current.remove()
      popupRef.current = null
    }
  }

  // Function to add point markers
  const addPointMarker = coordinates => {
    if (!mapCurrent) return
    const el = document.createElement('div')
    el.className = 'measurement-point'
    el.style.width = '10px'
    el.style.height = '10px'
    el.style.backgroundColor = '#3887be' // Adjusted color slightly
    el.style.borderRadius = '50%'
    el.style.border = '2px solid white'
    el.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.2)'
    el.style.cursor = 'pointer'

    const marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(mapCurrent)

    markersRef.current.push(marker)
  }

  // Cleanup function
  const cleanupMeasurement = () => {
    // Clear the data source
    updateDataSource(null)

    // Remove all markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Hide popup
    hidePopup()

    // Reset state
    setPoints([])
    currentPointsRef.current = []
    setMeasurement(null)
    setFirstPoint(null)
    setIsFinalized(false) // Reset finalized state
  }

  useEffect(() => {
    if (!mapCurrent) return

    // Add source and layers on mount
    mapCurrent.addSource(sourceIdRef.current, {
      type: 'geojson',
      data: null, // Start with empty data
    })

    mapCurrent.addLayer({
      id: layerIdRef.current,
      type: 'fill',
      source: sourceIdRef.current,
      paint: {
        'fill-color': '#3887be',
        'fill-opacity': 0.3,
      },
    })
    // Add a line layer for the border
    mapCurrent.addLayer({
      id: lineLayerIdRef.current,
      type: 'line',
      source: sourceIdRef.current,
      paint: {
        'line-color': '#3887be',
        'line-width': 2,
        'line-dasharray': [2, 2], // Dashed line for preview
      },
    })

    const handleClick = e => {
      const newPoint = [e.lngLat.lng, e.lngLat.lat]

      if (isFinalized) {
        cleanupMeasurement()
        // Treat this click as the first point (fall through)
      }

      // --- First Point ---
      if (currentPointsRef.current.length === 0) {
        setFirstPoint(newPoint)
        currentPointsRef.current = [newPoint]
        setPoints([newPoint])
        addPointMarker(newPoint)
        updateDataSource(null) // Clear any previous geometry
        setMeasurement(null)
        // hidePopup() // Removed: Let mousemove handle popup visibility
        return
      }

      // --- Finalization Check ---
      // Check if we have enough points to potentially close the polygon
      if (currentPointsRef.current.length >= 2) {
        // Use the coordinate from the ref, which is updated synchronously
        const firstPointCoords = currentPointsRef.current[0]
        if (firstPointCoords) {
          // Ensure the first point coordinate actually exists
          const firstPointPixels = mapCurrent.project(firstPointCoords) // Use ref value
          const clickPixels = mapCurrent.project(newPoint)
          const distance = firstPointPixels.dist(clickPixels)
          const isNearFirstPoint = distance < 15 // Pixel threshold (adjust as needed)

          if (isNearFirstPoint) {
            // Finalize
            const finalPoints = [...currentPointsRef.current, firstPointCoords] // Close with the actual first point coord
            currentPointsRef.current = finalPoints // Keep ref updated if needed, though it's final now
            setPoints(finalPoints) // Update state for potential display elsewhere

            // Update source with final closed polygon
            updateDataSource({ type: 'Polygon', coordinates: [finalPoints] })

            // Update line style to solid for final polygon
            mapCurrent.setPaintProperty(lineLayerIdRef.current, 'line-dasharray', [])

            const area = calculateAndUpdateArea(finalPoints)
            // Place popup near the second-to-last point for visibility
            // const popupCoord = finalPoints.length > 2 ? finalPoints[finalPoints.length - 2] : finalPoints[0]
            // updatePopup(popupCoord, `${area.toFixed(2)} km²`) // Removed popup on finalization
            hidePopup() // Hide any lingering popup from mousemove ON FINALIZATION

            setIsFinalized(true) // Set finalized state
            // Don't add a marker for the closing click
            return // Stop processing this click
          }
        }
      }

      // --- Add New Point (if not finalized) ---
      const updatedPoints = [...currentPointsRef.current, newPoint]
      currentPointsRef.current = updatedPoints
      setPoints(updatedPoints)
      addPointMarker(newPoint)

      // Ensure line remains dashed while drawing
      mapCurrent.setPaintProperty(lineLayerIdRef.current, 'line-dasharray', [2, 2])

      // Update preview (Polygon requires at least 3 points + closing point = 4 in array)
      if (updatedPoints.length >= 2) {
        // Need at least 2 points to draw a line/polygon preview
        // For area calculation preview, close the polygon temporarily
        const previewPolygonPoints = [...updatedPoints, currentPointsRef.current[0]] // Close with first point from ref

        // Update data source for fill and line layers
        updateDataSource({ type: 'Polygon', coordinates: [previewPolygonPoints] })

        if (updatedPoints.length >= 2) {
          // Calculate area preview only if it forms a polygon (needs 3 points placed)
          const area = calculateAndUpdateArea(previewPolygonPoints)
          // updatePopup(newPoint, `${area.toFixed(2)} km²`) // Removed popup on click
        } else {
          hidePopup()
        }
      } else {
        // Only one point placed, clear geometry and popup
        updateDataSource(null)
        hidePopup()
      }
    }

    const handleMouseMove = e => {
      // Only update preview if not finalized and at least TWO points have been placed
      // This prevents the preview line after only the first point is clicked.
      if (isFinalized || currentPointsRef.current.length < 2) {
        // If we only have 0 or 1 point, ensure the preview is cleared
        // (in case something lingered from a previous interaction)
        // and no popup is shown.
        updateDataSource(null)
        hidePopup()
        return
      }

      const currentPoint = [e.lngLat.lng, e.lngLat.lat]
      const tempPoints = [...currentPointsRef.current, currentPoint] // Points including the mouse position

      // At this point, we know currentPointsRef.current.length >= 2

      // Always show the polygon outline connecting to the mouse
      mapCurrent.setPaintProperty(lineLayerIdRef.current, 'line-dasharray', [2, 2]) // Ensure dash

      // Update data source for fill and line layers
      // Create a temporary closed polygon for visualization
      // Draw the preview polygon
      const previewGeometry = { type: 'Polygon', coordinates: [[...tempPoints, currentPointsRef.current[0]]] } // Close polygon for preview
      updateDataSource(previewGeometry)

      // Update popup with area preview (we already know we have enough points)
      const previewPolygonPoints = [...currentPointsRef.current, currentPoint, currentPointsRef.current[0]] // Close for area calculation
      const area = calculateAndUpdateArea(previewPolygonPoints)
      updatePopup(currentPoint, `${area.toFixed(2)} km²`)
    }

    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        cleanupMeasurement()
      }
    }

    mapCurrent.on('click', handleClick)
    mapCurrent.on('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup on component unmount or map change
    return () => {
      mapCurrent.off('click', handleClick)
      mapCurrent.off('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
      // Remove layers and source if map still exists
      if (mapCurrent.getLayer(layerIdRef.current)) {
        mapCurrent.removeLayer(layerIdRef.current)
      }
      if (mapCurrent.getLayer(lineLayerIdRef.current)) {
        mapCurrent.removeLayer(lineLayerIdRef.current)
      }
      if (mapCurrent.getSource(sourceIdRef.current)) {
        mapCurrent.removeSource(sourceIdRef.current)
      }
      cleanupMeasurement() // Final cleanup of markers, popups, state
    }
  }, [mapCurrent]) // Rerun effect if map instance changes

  // This component doesn't render anything itself, it just interacts with the map
  return null
}

export default AreaMeasurementTool
