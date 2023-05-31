import { ListItem, ListItemButton } from '@mui/material'
import { useSelector } from 'react-redux'

import { isMobile } from '../../../utils'
import dayjs from '../../../utils/dayjs'
import './index.scss'

const EarthquakeItem = props => {
  const { index, style, earthquake, handleActionListDisable } = props

  const mapCurrent = useSelector(state => state.earthquake.mapCurrent)

  const handleFocusPoint = coordinates => {
    if (isMobile()) handleActionListDisable()
    mapCurrent.flyTo({
      center: coordinates,
      essential: true,
      zoom: 10,
    })
  }

  return (
    <ListItem className="earthquake-raw" style={style} key={index} component="div">
      <ListItemButton
        onClick={() => handleFocusPoint(earthquake.properties.coordinates)}
        className={`earthquake-raw__button ${earthquake.properties.isNewEarthquake && 'earthquake-raw__button--new'}`}>
        {earthquake.properties.isNewEarthquake && <div className="earthquake-raw__just-now">&#8226;</div>}
        <div className="earthquake-raw__line">
          <div className="earthquake-raw__item earthquake-raw__item--intensity">{earthquake.properties.mag}</div>
          <div className="earthquake-raw__circle-character">&#9679;</div>
          <div className="earthquake-raw__item earthquake-raw__item--depth">{earthquake.properties.depth} km</div>
          <div className="earthquake-raw__circle-character">&#9679;</div>
          <div className="earthquake-raw__item earthquake-raw__item--date">
            {dayjs(earthquake.properties.date).format('HH:mm ddd (UTCZ)')}
          </div>
        </div>
        <div className="earthquake-raw__item earthquake-raw__item--title">{earthquake.properties.title}</div>
      </ListItemButton>
    </ListItem>
  )
}

export default EarthquakeItem
