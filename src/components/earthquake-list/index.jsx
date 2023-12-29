import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'

import { SORTING_TYPE_VALUES } from '../../constants'
import constantsTestid from '../../constants/testid'
import getEarthquakes from '../../hooks/getEarthquakes'
import useMapboxPopup from '../../hooks/useMapboxPopup'
import { changeURL, includeText } from '../../utils'
import dayjs from '../../utils/dayjs'
import { setEarthquakeIDQueryParam } from '../../utils/queryParamsActions'
import MapEarthquakePopup from '../tracking-map/map-popups/map-earthquake-popup'
import EarthquakeFilters, { EARTHQUAKE_LIST_SORTING_TYPES } from './earthquake-filters'
import EarthquakeItem from './earthquake-item'
import './index.scss'

const boxProps = {
  sx: { width: '100%', height: '100%', bgcolor: 'transparent', color: 'white' },
}

const EarthquakeList = ({ handleActionListDisable }) => {
  const testid = constantsTestid.earthquakeList
  const { t } = useTranslation()

  const [listHeight, setListHeight] = useState(0)
  const [allFilters, setAllFilters] = useState({
    text: '',
    sorting: {
      type: EARTHQUAKE_LIST_SORTING_TYPES.DATE,
      value: SORTING_TYPE_VALUES.ASC,
    },
  })

  const { enableMapboxPopup, disableAllMapboxPopup } = useMapboxPopup()

  const earthquakeSorting = (a, b) => {
    const sortingValue = allFilters.sorting.value

    switch (allFilters.sorting.type) {
      case EARTHQUAKE_LIST_SORTING_TYPES.DATE:
        return dayjs(a.properties.date).isAfter(b.properties.date) ? sortingValue : 0
      case EARTHQUAKE_LIST_SORTING_TYPES.MAG:
        const firstMag = parseFloat(a.properties.mag)
        const secondMag = parseFloat(b.properties.mag)

        return sortingValue === SORTING_TYPE_VALUES.ASC ? secondMag - firstMag : firstMag - secondMag
    }
  }
  const earthquakeFilter = earthquake => includeText(earthquake.properties.title, allFilters.text)

  const earthquakes = getEarthquakes().filter(earthquakeFilter).sort(earthquakeSorting)

  useEffect(() => {
    const earthquakeListHeight = document.getElementsByClassName('earthquake-list__list-container')[0]?.offsetHeight
    setListHeight(earthquakeListHeight)
  }, [])

  const fixedSizeListProps = {
    height: listHeight,
    width: '100%',
    itemSize: 85,
    itemCount: earthquakes.length,
    overscanCount: 5,
    className: 'earthquake-list__list',
  }

  const handleOnClickItem = earthquake => {
    const { properties } = earthquake

    disableAllMapboxPopup()
    enableMapboxPopup({
      coordinates: properties.coordinates,
      popupContent: <MapEarthquakePopup earthquake={properties} />,
    })

    const url = setEarthquakeIDQueryParam(properties.earthquake_id)
    changeURL(url)
  }

  return (
    <div data-testid={testid.listContainer} className="earthquake-list">
      <EarthquakeFilters allFilters={allFilters} setAllFilters={setAllFilters} />
      <div className="earthquake-list__list-container">
        {earthquakes.length > 0 ? (
          <Box data-testid={testid.list} {...boxProps}>
            <FixedSizeList {...fixedSizeListProps}>
              {({ index, style }) => (
                <EarthquakeItem
                  handleOnClickItem={handleOnClickItem}
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
