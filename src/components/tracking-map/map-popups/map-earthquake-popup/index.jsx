import React from 'react'
import { useTranslation } from 'react-i18next'

import { SOURCE_COLOR } from '../../../../constants'
import constantsTestid from '../../../../constants/testid'
import dayjs from '../../../../utils/dayjs'
import './index.scss'
import MapEarthquakePopupShareList from './map-earthquake-popup-share-list'

const MapEarthquakePopup = props => {
  const testid = constantsTestid.mapEarthquakePopup
  const { earthquake } = props
  const { t } = useTranslation()

  return (
    <div data-testid={testid.container} className="earthquake-popup">
      <div className="earthquake-popup__mag">
        <span className="earthquake-popup__mag-number">{earthquake.mag}</span>
        <span className="earthquake-popup__mag-text">{t('Magnitude').toUpperCase()}</span>
      </div>
      <div className="earthquake-popup__tags">
        <div className="earthquake-popup__tag-item earthquake-popup__tag-item--source">
          <div style={{ backgroundColor: SOURCE_COLOR[earthquake.source] }} className="earthquake-popup__tag-item-bg" />
          <div className="earthquake-popup__tag-item-text">{earthquake.source}</div>
        </div>
      </div>
      <div className="earthquake-popup__info">
        <div>&#x2022; {dayjs(earthquake.date).format('HH:mm dddd (UTCZ)')}</div>
        <div>&#x2022; {t('{kmCount} km deep').replace('{kmCount}', earthquake.depth)}</div>
        <div>&#x2022; {earthquake.title.toLowerCase()}</div>
      </div>
      <div className="earthquake-popup__line" />
      <MapEarthquakePopupShareList earthquake={earthquake} />
    </div>
  )
}

export default MapEarthquakePopup
