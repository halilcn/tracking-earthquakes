import { ListItem, ListItemButton } from '@mui/material'
import React from 'react'
import { FaClock } from 'react-icons/fa'
import { IoLayers } from 'react-icons/io5'
import { useSelector } from 'react-redux'

import constantsTestId from '../../../constants/testid'
import { getPointColorByIntensity, isMobile } from '../../../utils'
import dayjs from '../../../utils/dayjs'
import './index.scss'

const EarthquakeItem = props => {
  const { index, style, earthquake, handleActionListDisable, handleOnClickItem } = props
  const testid = constantsTestId.earthquakeItem

  const earthquakeProperties = earthquake.properties
  const mapCurrent = useSelector(state => state.earthquake.mapCurrent)

  const handleFocusPoint = () => {
    if (isMobile()) handleActionListDisable()
    mapCurrent.flyTo({
      center: earthquakeProperties.coordinates,
      essential: true,
      zoom: 5,
    })

    handleOnClickItem(earthquake)
  }

  return (
    <ListItem data-testid={testid.itemContainer} className="earthquake-raw" style={style} key={index} component="div">
      <ListItemButton
        data-testid={testid.itemButton}
        onClick={handleFocusPoint}
        className={`earthquake-raw__button ${earthquakeProperties.isNewEarthquake && 'earthquake-raw__button--new'}`}>
        {earthquakeProperties.isNewEarthquake && (
          <div data-testid={testid.newEarthquakeIcon} className="earthquake-raw__just-now">
            &#8226;
          </div>
        )}
        <div className="earthquake-raw__line">
          <div
            className="earthquake-raw__item earthquake-raw__item--intensity"
            style={{ color: getPointColorByIntensity(earthquakeProperties.mag) }}>
            {earthquakeProperties.mag}
          </div>
          <div className="earthquake-raw__item earthquake-raw__item--tag earthquake-raw__item--depth">
            <IoLayers className="earthquake-raw__item-icon" />
            <span>{earthquakeProperties.depth} km</span>
          </div>
          <div className="earthquake-raw__item earthquake-raw__item--tag earthquake-raw__item--date">
            <FaClock className="earthquake-raw__item-icon" />
            <span>{dayjs(earthquakeProperties.date).format('DD MMM ddd - HH:mm')}</span>
          </div>
        </div>
        <div className="earthquake-raw__item earthquake-raw__item--title">{earthquakeProperties.title}</div>
      </ListItemButton>
    </ListItem>
  )
}

export default EarthquakeItem
