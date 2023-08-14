import React from 'react'
import { useTranslation } from 'react-i18next'
import { AiFillTwitterCircle, AiOutlineWhatsApp } from 'react-icons/ai'

import { APP_URL, DEFAULT_API_DATE_FORMAT, SOURCE_COLOR } from '../../../../constants'
import constantsTestid from '../../../../constants/testid'
import dayjs from '../../../../utils/dayjs'
import { setEarthquakeIDQueryParam, setLatLongQueryParam, setPastEarthquakeDatesQueryParam } from '../../../../utils/queryParamsActions'
import './index.scss'

const CONTENT_TYPE = {
  TWITTER: 'TWITTER',
  WHATSAPP: 'WHATSAPP',
}

const MapEarthquakePopup = props => {
  const testid = constantsTestid.mapEarthquakePopup
  const { earthquake } = props
  const { t } = useTranslation()

  const getEarthquakeURL = () => {
    let url = new URL(APP_URL)
    const startDate = dayjs(earthquake.date).add(-2, 'day').format(DEFAULT_API_DATE_FORMAT)
    const endDate = dayjs(earthquake.date).add(1, 'day').format(DEFAULT_API_DATE_FORMAT)

    url = setLatLongQueryParam(earthquake.coordinates, url)
    url = setPastEarthquakeDatesQueryParam({ startDate, endDate }, url)
    url = setEarthquakeIDQueryParam(earthquake.earthquake_id, url)

    return encodeURIComponent(url.href)
  }

  const getMessageContent = type => {
    switch (type) {
      case CONTENT_TYPE.TWITTER:
        return `${earthquake.isNewEarthquake ? 'New Earthquake: ' : ''} ${earthquake.mag} magnitude, ${
          earthquake.depth
        } depth, ${earthquake.title.toLowerCase()}, ${dayjs(earthquake.date).format('HH:mm dddd (UTCZ)')}`
      case CONTENT_TYPE.WHATSAPP:
        return `${earthquake.mag} magnitude, ${earthquake.title.toLowerCase()}, ${dayjs(earthquake.date).format(
          'HH:mm dddd (UTCZ)'
        )} ,${getEarthquakeURL()}`
    }
  }

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
      <div className="earthquake-popup__share">
        <div className="earthquake-popup__share-text">share with</div>
        <div className="earthquake-popup__share-list">
          <a
            data-testid={testid.twitterShareButton}
            className="earthquake-popup__share-item"
            href={`https://twitter.com/intent/tweet?text=${getMessageContent(
              CONTENT_TYPE.TWITTER
            )}&url=${getEarthquakeURL()}&hashtags=earthquake`}
            data-size="large"
            target="blank">
            <AiFillTwitterCircle />
          </a>
          <a
            data-testid={testid.whatsappShareButton}
            className="earthquake-popup__share-item"
            href={`https://wa.me/?text=${getMessageContent(CONTENT_TYPE.WHATSAPP)}`}
            target="blank">
            <AiOutlineWhatsApp />
          </a>
        </div>
      </div>
    </div>
  )
}

export default MapEarthquakePopup
