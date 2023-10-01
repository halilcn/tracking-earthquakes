import React from 'react'
import { useTranslation } from 'react-i18next'

import LiveEarthquake from '../../../../public/live-earthquake.png'
import PopulationDensityHigh from '../../../../public/population-density-high.png'
import PopulationDensityLow from '../../../../public/population-density-low.png'
import { INTENSITY_LEVELS, POINT_COLOR, POINT_SIZE, SOURCE_COLOR } from '../../../constants'
import Popup from '../../popup'
import './index.scss'

const InfoPopup = props => {
  const { enabled, disableHandle } = props

  const { t } = useTranslation()

  return (
    <Popup title={t('Info')} enabled={enabled} disableHandle={disableHandle}>
      <div className="info-popup__item">
        <div className="info-popup__label">
          <div className="info-popup__title">{t('Earthquake Magnitude')}</div>
          <div className="info-popup__description">{t('Each level of earthquake magnitude has a different color')}</div>
        </div>
        <div className="info-popup__magnitude">
          <div className="info-popup__magnitude-title info-popup__magnitude-title--first">+2</div>
          {Object.values(INTENSITY_LEVELS).map((intensity, index) => (
            <div
            key={index}
              className="info-popup__magnitude-item"
              style={{ backgroundColor: POINT_COLOR[intensity], width: POINT_SIZE[intensity] * 2, height: POINT_SIZE[intensity] * 2 }}
            />
          ))}
          <div className="info-popup__magnitude-title info-popup__magnitude-title--last">+7</div>
        </div>
      </div>
      <div className="info-popup__item">
        <div className="info-popup__label">
          <div className="info-popup__title">{t('Live Earthquake')}</div>
          <div className="info-popup__description">{t('Flashing animation')}</div>
        </div>
        <img src={LiveEarthquake} className="info-popup__live-earthquake" />
      </div>
      <div className="info-popup__item">
        <div className="info-popup__label">
          <div className="info-popup__title">{t('Fault Line')}</div>
          <div className="info-popup__description">{t('Red line')}</div>
        </div>
        <div className="info-popup__fault-line" />
      </div>
      <div className="info-popup__item">
        <div className="info-popup__label">
          <div className="info-popup__title">{t('Population Density')}</div>
          <div className="info-popup__description">{t('Different colors according to density')}</div>
        </div>
        <div className="info-popup__population-density">
          <img src={PopulationDensityLow} />
          <img src={PopulationDensityHigh} />
        </div>
      </div>
      <div className="info-popup__item">
        <div className="info-popup__label">
          <div className="info-popup__title">{t('Earthquake Source Color')}</div>
          <div className="info-popup__description">{t('Each source of earthquake has different color to detect')}</div>
        </div>
        <div className="info-popup__source-color-content">
          {Object.keys(SOURCE_COLOR).map((source, index) => (
            <div key={index} className="info-popup__source-color">
              <div className="info-popup__source-color-text">{source}</div>
              <div style={{ borderColor: SOURCE_COLOR[source] }} className="info-popup__source-color-circle" />
            </div>
          ))}
        </div>
      </div>
    </Popup>
  )
}

export default InfoPopup
