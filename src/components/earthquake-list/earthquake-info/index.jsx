import React from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosInformationCircleOutline } from 'react-icons/io'

import './index.scss'

const EarthquakeInfo = props => {
  const { earthquakesCount } = props

  const { t } = useTranslation()

  return (
    <div className="earthquake-info">
      <IoIosInformationCircleOutline />
      <div className="earthquake-info__text">{t('Total of {count} earthquakes').replace('{count}', earthquakesCount)}</div>
    </div>
  )
}

export default EarthquakeInfo
