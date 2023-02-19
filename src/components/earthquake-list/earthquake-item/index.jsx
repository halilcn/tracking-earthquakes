import { ListItem, ListItemButton } from '@mui/material'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

import './index.scss'

const EarthquakeItem = props => {
  const { index, style, earthquake } = props

  const mapCurrent = useSelector(state => state.earthquake.mapCurrent)

  const handleFocusPoint = coordinates => {
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
        {earthquake.properties.isNewEarthquake && <div className="earthquake-raw__just-now">now</div>}
        <div className="earthquake-raw__line">
          <div className="earthquake-raw__item earthquake-raw__item--intensity">{earthquake.properties.mag}</div>
          <div className="earthquake-raw__circle-character">&#9679;</div>
          <div className="earthquake-raw__item earthquake-raw__item--depth">{earthquake.properties.depth} km</div>
          <div className="earthquake-raw__circle-character">&#9679;</div>
          <div className="earthquake-raw__item earthquake-raw__item--date">{dayjs(earthquake.properties.date).format('hh:mm dddd')}</div>
        </div>
        <div className="earthquake-raw__item earthquake-raw__item--title">{earthquake.properties.title}</div>
      </ListItemButton>
    </ListItem>
  )
}

export default EarthquakeItem
