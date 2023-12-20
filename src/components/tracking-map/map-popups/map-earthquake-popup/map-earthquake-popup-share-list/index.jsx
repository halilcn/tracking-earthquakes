import React from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiFillTwitterCircle, AiOutlineLink, AiOutlineWhatsApp } from 'react-icons/ai'

import { DEFAULT_API_DATE_FORMAT } from '../../../../../constants'
import { copyText } from '../../../../../utils'
import dayjs from '../../../../../utils/dayjs'
import { setEarthquakeIDQueryParam, setLatLongQueryParam, setPastEarthquakeDatesQueryParam } from '../../../../../utils/queryParamsActions'
import './index.scss'

const MapEarthquakePopupShareList = props => {
  const { earthquake } = props

  const [isCopyShareTypeCopied, setIsCopyShareTypeCopied] = useState(false)

  const copyShareTypeTimeoutRef = useRef(null)
  const { t } = useTranslation()

  const getEarthquakeURL = () => {
    let url = new URL(window.location.href)

    const startDate = dayjs(earthquake.date).add(-2, 'day').format(DEFAULT_API_DATE_FORMAT)
    const endDate = dayjs(earthquake.date).add(1, 'day').format(DEFAULT_API_DATE_FORMAT)

    url = setLatLongQueryParam(earthquake.coordinates, url)
    url = setPastEarthquakeDatesQueryParam({ startDate, endDate }, url)
    url = setEarthquakeIDQueryParam(earthquake.earthquake_id, url)

    return url.href
  }
  const getEncodedEarthquakeURL = () => encodeURIComponent(getEarthquakeURL())

  const handleClickCopyUrlButton = () => {
    if (copyShareTypeTimeoutRef.current) {
      clearTimeout(copyShareTypeTimeoutRef.current)
    }

    copyText(getEarthquakeURL())
    setIsCopyShareTypeCopied(true)

    copyShareTypeTimeoutRef.current = setTimeout(() => {
      setIsCopyShareTypeCopied(false)
      copyShareTypeTimeoutRef.current = null
    }, 1500)
  }

  const getTwitterContent = () => {
    const earthquakeTitleContent = `${earthquake.isNewEarthquake ? t('New Earthquake') : t('Earthquake')}:`

    return `${earthquakeTitleContent} ${earthquake.mag} ${t('Magnitude').toLowerCase()}, ${earthquake.depth} ${t(
      'Depth'
    ).toLowerCase()}, ${earthquake.title.toLowerCase()}, ${dayjs(earthquake.date).format('HH:mm dddd (UTCZ)')}`
  }

  const getWhatSappContent = () => {
    const earthquakeTitleContent = (earthquake.isNewEarthquake ? t('New Earthquake') : t('Earthquake')).toUpperCase()

    return `${earthquakeTitleContent} %0a●${earthquake.mag} ${t('Magnitude').toLowerCase()} %0a●${dayjs(earthquake.date).format(
      'HH:mm dddd (UTCZ)'
    )} %0a●${earthquake.title.toLowerCase()} %0a${getEncodedEarthquakeURL()}`
  }

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${getTwitterContent()}&url=${getEncodedEarthquakeURL()}&hashtags=earthquake`
  const whatsappShareUrl = `https://wa.me/?text=${getWhatSappContent()}`

  return (
    <div className="earthquake-popup-share">
      <div className="earthquake-popup-share__text">{t('Share')}</div>
      <div className="earthquake-popup-share__list">
        <div className="earthquake-popup-share__item">
          {isCopyShareTypeCopied && <div className="earthquake-popup-share__item-tooltip">{t('Copied!')}</div>}
          <AiOutlineLink onClick={handleClickCopyUrlButton} />
        </div>
        <a className="earthquake-popup-share__item" href={twitterShareUrl} data-size="large" target="blank">
          <AiFillTwitterCircle />
        </a>
        <a className="earthquake-popup-share__item" href={whatsappShareUrl} target="blank">
          <AiOutlineWhatsApp />
        </a>
      </div>
    </div>
  )
}

export default MapEarthquakePopupShareList
