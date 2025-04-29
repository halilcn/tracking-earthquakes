import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'
import { IoMdCompass } from 'react-icons/io'
import { MdOutlineSquare, MdOutlineStraighten } from 'react-icons/md'
import { useSelector } from 'react-redux'

import { MAP_DEFAULT_ZOOM_HOME } from '../../../constants'
import useCurrentPosition from '../../../hooks/useCurrentPosition'
import './index.scss'
import MeasurementTool from './measurement-tool'

export const MEASURE_TYPES = {
  DISTANCE: 'distance',
  AREA: 'area',
}

const MapTools = ({ handleChangeIsEnabledMapActions }) => {
  const [measurementType, setMeasurementType] = useState(null)

  const { mapCurrent } = useSelector(state => state.earthquake)
  const { currentPosition, isAllowed: isAllowedLocation } = useCurrentPosition()

  const isMeasuring = measurementType !== null

  const checkMeasurementType = type => measurementType === type

  const handleFlyToHome = () => {
    mapCurrent?.flyTo({
      center: [currentPosition.lang, currentPosition.lat],
      zoom: MAP_DEFAULT_ZOOM_HOME,
    })
  }

  const handleResetNorth = () => {
    mapCurrent?.resetNorth()
  }

  const handleZoomIn = () => {
    mapCurrent?.zoomIn()
  }

  const handleZoomOut = () => {
    mapCurrent?.zoomOut()
  }

  const handleStartMeasurement = type => () => {
    if (isMeasuring) {
      setMeasurementType(null)
      if (mapCurrent?.getCanvas()) mapCurrent.getCanvas().style.cursor = ''

      return
    }

    setMeasurementType(type)
    if (mapCurrent?.getCanvas()) mapCurrent.getCanvas().style.cursor = 'crosshair'
  }

  useEffect(() => {
    handleChangeIsEnabledMapActions(measurementType === null)
  }, [measurementType])

  return (
    <>
      <div className="custom-map-controls">
        <div
          className={classNames('custom-map-controls__item', { 'custom-map-controls__item--disabled': !isAllowedLocation })}
          onClick={handleFlyToHome}>
          <HiHome />
        </div>
        <div className="custom-map-controls__item" onClick={handleResetNorth}>
          <IoMdCompass />
        </div>
        <div
          className={classNames('custom-map-controls__item', {
            'custom-map-controls__item--active': isMeasuring && checkMeasurementType(MEASURE_TYPES.DISTANCE),
          })}
          onClick={handleStartMeasurement(MEASURE_TYPES.DISTANCE)}>
          <MdOutlineStraighten />
        </div>
        <div
          className={classNames('custom-map-controls__item', {
            'custom-map-controls__item--active': isMeasuring && checkMeasurementType(MEASURE_TYPES.AREA),
          })}
          onClick={handleStartMeasurement(MEASURE_TYPES.AREA)}>
          <MdOutlineSquare />
        </div>
        <div className="custom-map-controls__item custom-map-controls__zoom-controls">
          <FiPlus className="custom-map-controls__zoom-control-item" onClick={handleZoomIn} />
          <FiMinus className="custom-map-controls__zoom-control-item" onClick={handleZoomOut} />
        </div>
      </div>
      {isMeasuring && <MeasurementTool type={measurementType} />}
    </>
  )
}

export default MapTools
