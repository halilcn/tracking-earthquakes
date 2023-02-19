import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'
import getEarthquakes from '../../hooks/getEarthquakes'
import EarthquakeItem from './earthquake-item'
import NewCustomPoint from './new-custom-point'

import './index.scss'

const EarthquakeList = () => {
  const isActiveCustomPointSelection = useSelector(state => state.earthquake.isActiveCustomPointSelection)
  const earthquakes = getEarthquakes()

  const boxProps = {
    sx: { width: '100%', height: '100%', bgcolor: 'transparent', color: 'white' },
  }

  const fixedSizeListProps = {
    height: document.body.offsetHeight,
    width: '100%',
    itemSize: 85,
    itemCount: earthquakes.length,
    overscanCount: 5,
  }

  return (
    <div className="earthquake-list">
      {isActiveCustomPointSelection && <NewCustomPoint />}
      {!isActiveCustomPointSelection && (
        <div className="earthquake-list__list-container">
          <Box {...boxProps}>
            <FixedSizeList {...fixedSizeListProps}>
              {({ index, style }) => <EarthquakeItem earthquake={earthquakes[index]} index={index} style={style} />}
            </FixedSizeList>
          </Box>
        </div>
      )}
    </div>
  )
}

export default EarthquakeList
