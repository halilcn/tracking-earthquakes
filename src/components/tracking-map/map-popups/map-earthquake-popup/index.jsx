import { useTranslation } from 'react-i18next'

import dayjs from '../../../../utils/dayjs'
import './index.scss'

const MapEarthquakePopup = props => {
  const { earthquake } = props
  const { t } = useTranslation()

  return (
    <div className="earthquake-popup">
      <div className="earthquake-popup__mag">
        <span className="earthquake-popup__mag-number">{earthquake.mag}</span>
        <span className="earthquake-popup__mag-text">{t('Magnitude').toUpperCase()}</span>
      </div>
      <div className="earthquake-popup__info">
        <div>&#x2022; {dayjs(earthquake.date).format('HH:mm dddd (UTCZ)')}</div>
        <div>&#x2022; {t('{kmCount} km deep').replace('{kmCount}', earthquake.depth)}</div>
        <div>&#x2022; {t('from {sourceInfo}').replace('{sourceInfo}', earthquake.source)}</div>
        <div>&#x2022; {earthquake.title.toLowerCase()}</div>
      </div>
      <div className="earthquake-popup__line" />
      <div className="earthquake-popup__share"></div>
    </div>
  )
}

export default MapEarthquakePopup
