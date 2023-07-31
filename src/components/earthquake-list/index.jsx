import { Box, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'

import constantsTestid from '../../constants/testid'
import getEarthquakes from '../../hooks/getEarthquakes'
import dayjs from './../../utils/dayjs'
import EarthquakeItem from './earthquake-item'
import './index.scss'

const EarthquakeList = ({ handleActionListDisable }) => {
  const testid = constantsTestid.earthquakeList
  const { t } = useTranslation()

  const [textFilter, setTextFilter] = useState('')
  const [listHeight, setListHeight] = useState(0)

  const earthquakes = getEarthquakes()
    .filter(earthquake => earthquake.properties.location_properties.epiCenter.name?.toLowerCase().includes(textFilter.toLowerCase()))
    .sort((a, b) => (dayjs(a.properties.date).isAfter(b.properties.date) ? -1 : 1))

  const handleChangeTextFilter = e => setTextFilter(e.target.value)

  useEffect(() => {
    const earthquakeListHeight = document.getElementsByClassName('earthquake-list__list-container')[0]?.offsetHeight
    setListHeight(earthquakeListHeight)
  }, [])

  const boxProps = {
    sx: { width: '100%', height: '100%', bgcolor: 'transparent', color: 'white' },
  }

  const textFieldProps = {
    label: t('Anywhere'),
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
    className: 'earthquake-list__list',
  }

  return (
    <div data-testid={testid.listContainer} className="earthquake-list">
      <div className="earthquake-list__filter-text">
        <TextField {...textFieldProps} />
      </div>
      <div className="earthquake-list__list-container">
        {earthquakes.length > 0 ? (
          <Box data-testid={testid.list} {...boxProps}>
            <FixedSizeList {...fixedSizeListProps}>
              {({ index, style }) => (
                <EarthquakeItem
                  handleActionListDisable={handleActionListDisable}
                  earthquake={earthquakes[index]}
                  index={index}
                  style={style}
                />
              )}
            </FixedSizeList>
          </Box>
        ) : (
          <div data-testid={testid.noEarthquakeWarn} className="earthquake-list__no-earthquake-warning">
            {t("There aren't any earthquakes")}
          </div>
        )}
      </div>
    </div>
  )
}

export default EarthquakeList
