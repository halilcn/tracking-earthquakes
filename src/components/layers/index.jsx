import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineClose } from 'react-icons/ai'
import { FaGripLinesVertical } from 'react-icons/fa'
import { FaPeopleArrows } from 'react-icons/fa'
import { IoLayers } from 'react-icons/io5'
import { VscActivateBreakpoints } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'

import { MAPBOX_SOURCES, SOURCE_COLOR_DISABLE_VALUE, SOURCE_COLOR_ENABLE_VALUE } from '../../constants'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import { earthquakeActions } from '../../store/earthquake'
import { setFaultLineActive, setPopulationDensityActive, setSourceColorActive } from '../../utils/localStorageActions'
import './index.scss'

const Layers = () => {
  const [isEnabledLayers, setIsEnabledLayers] = useState(false)

  const layerRef = useRef(null)

  const mapCurrent = useSelector(state => state.earthquake.mapCurrent)

  useOnClickOutside(layerRef, () => {
    setIsEnabledLayers(false)
  })

  const handleOnClickLayerButton = () => {
    setIsEnabledLayers(prev => !prev)
  }

  const settings = useSelector(state => state.earthquake.settings)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleChangeSetting = (key, value) => {
    dispatch(earthquakeActions.updateSettings({ [key]: value }))
  }

  const getNewSettingValue = settingKey => !settings[settingKey]

  const handleOnClickSourceColor = key => () => {
    const newValue = getNewSettingValue(key)

    handleChangeSetting(key, newValue)
    setSourceColorActive(newValue)

    mapCurrent.setPaintProperty(
      MAPBOX_SOURCES.LAYER_DATA_CIRCLE,
      'circle-stroke-width',
      newValue ? SOURCE_COLOR_ENABLE_VALUE : SOURCE_COLOR_DISABLE_VALUE
    )
  }

  const handleOnClickFaultLine = key => () => {
    const newValue = getNewSettingValue(key)

    handleChangeSetting(key, newValue)
    setFaultLineActive(newValue)
  }

  const handleOnClickPopulationDensity = key => () => {
    const newValue = getNewSettingValue(key)

    handleChangeSetting(key, newValue)
    setPopulationDensityActive(newValue)
  }

  const handleOnClickCloseButton = () => {
    setIsEnabledLayers(false)
  }

  const items = [
    {
      key: 'isEnabledFaultLine',
      icon: <FaGripLinesVertical />,
      text: t('Fault Line'),
      handleOnClick: handleOnClickFaultLine,
    },
    {
      key: 'isEnabledPopulationDensity',
      icon: <FaPeopleArrows />,
      text: t('Population Density'),
      handleOnClick: handleOnClickPopulationDensity,
    },
    {
      key: 'isEnabledSourceColor',
      icon: <VscActivateBreakpoints />,
      text: t('Earthquake Source Color'),
      handleOnClick: handleOnClickSourceColor,
    },
  ]

  const actionListProps = {
    className: 'layers__content',
    animate: isEnabledLayers ? 'open' : 'closed',
    transition: {
      duration: 0.2,
    },
    variants: {
      open: { opacity: 1, display: 'block' },
      closed: {
        opacity: 0,
        transitionEnd: { display: 'none' },
      },
    },
  }

  return (
    <div className="layers" ref={layerRef}>
      <div
        onClick={handleOnClickLayerButton}
        className={classNames('layers__button', {
          'layers__button--active': isEnabledLayers,
        })}>
        <div className="layers__button-filter" />
        <IoLayers />
        <span className="layers__button-text">{t('layers')}</span>
      </div>
      <motion.div {...actionListProps}>
        <AiOutlineClose onClick={handleOnClickCloseButton} className="layers__close-btn" />
        <div className="layers__content-list">
          {items.map(item => (
            <div
              onClick={item.handleOnClick(item.key)}
              className={classNames('layers__item', { 'layers__item--selected': settings[item.key] })}>
              {item.icon}
              <span className="layers__item-text">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Layers
