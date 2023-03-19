import { Box, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'
import { useEffect, useState } from 'react'
import getEarthquakes from '../../hooks/getEarthquakes'
import EarthquakeItem from './earthquake-item'
import NewCustomPoint from './new-custom-point'

import './index.scss'

const EarthquakeList = () => {
  const [textFilter, setTextFilter] = useState('')
  const [listHeight, setListHeight] = useState(0)

  const isActiveCustomPointSelection = useSelector(state => state.earthquake.isActiveCustomPointSelection)
  const earthquakes = getEarthquakes().filter(earthquake =>
    earthquake.properties.location_properties.epiCenter.name?.toLowerCase().includes(textFilter.toLowerCase())
  )

  useEffect(() => {
    const earthquakeListHeight = document.getElementsByClassName('earthquake-list__list-container')[0]?.offsetHeight
    setListHeight(earthquakeListHeight)
  }, [])

  const handleChangeTextFilter = e => setTextFilter(e.target.value)

  const boxProps = {
    sx: { width: '100%', height: '100%', bgcolor: 'transparent', color: 'white' },
  }

  const textFieldProps = {
    label: 'Şehir',
    variant: 'standard',
    sx: {
      input: {
        color: 'white',
      },
      label: {
        color: 'white',
      },
      width: '100%',
    },
    onChange: handleChangeTextFilter,
  }

  const fixedSizeListProps = {
    height: listHeight,
    width: '100%',
    itemSize: 85,
    itemCount: earthquakes.length,
    overscanCount: 5,
  }

  return (
    <div className="earthquake-list">
      {isActiveCustomPointSelection && <NewCustomPoint />}
      {!isActiveCustomPointSelection && (
        <>
          <div className="earthquake-list__filter-text">
            <TextField {...textFieldProps} />
          </div>
          {earthquakes.length > 0 ? (
            <div className="earthquake-list__list-container">
              <Box {...boxProps}>
                <FixedSizeList {...fixedSizeListProps}>
                  {({ index, style }) => <EarthquakeItem earthquake={earthquakes[index]} index={index} style={style} />}
                </FixedSizeList>
              </Box>
            </div>
          ) : (
            <div className="earthquake-list__no-earthquake-warning">Hiç deprem bulunamadı...</div>
          )}
        </>
      )}
    </div>
  )
}

export default EarthquakeList
