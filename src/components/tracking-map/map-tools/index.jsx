import classNames from 'classnames'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'
import { IoMdCompass } from 'react-icons/io'
import { useSelector } from 'react-redux'

import { MAP_DEFAULT_ZOOM_HOME } from '../../../constants'
import useCurrentPosition from '../../../hooks/useCurrentPosition'
import './index.scss'

const MapTools = () => {
  const { mapCurrent } = useSelector(state => state.earthquake)

  const { currentPosition, isAllowed: isAllowedLocation } = useCurrentPosition()

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

  return (
    <div className="custom-map-controls">
      <div
        className={classNames('custom-map-controls__item', { 'custom-map-controls__item--disabled': !isAllowedLocation })}
        onClick={handleFlyToHome}>
        <HiHome />
      </div>
      <div className="custom-map-controls__item" onClick={handleResetNorth}>
        <IoMdCompass />
      </div>
      <div className="custom-map-controls__item custom-map-controls__zoom-controls">
        <FiPlus className="custom-map-controls__zoom-control-item" onClick={handleZoomIn} />
        <FiMinus className="custom-map-controls__zoom-control-item" onClick={handleZoomOut} />
      </div>
    </div>
  )
}

export default MapTools
