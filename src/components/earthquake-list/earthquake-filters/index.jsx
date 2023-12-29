import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SORTING_TYPE_VALUES } from '../../../constants'
import { debounce } from '../../../utils'
import './index.scss'

export const EARTHQUAKE_LIST_SORTING_TYPES = {
  DATE: 'date',
  MAG: 'mag',
}

const EarthquakeFilters = props => {
  const { allFilters, setAllFilters } = props

  const [filterText, setFilterText] = useState('')

  const { t } = useTranslation()

  const updateSortingFilter = sortingFilter => setAllFilters(prev => ({ ...prev, sorting: sortingFilter }))
  const updateTextFilter = textFilter => setAllFilters(prev => ({ ...prev, text: textFilter }))

  const handleChangeTextFilter = e => setFilterText(e.target.value)
  const handleChangeEarthquakeSorting = e => updateSortingFilter(JSON.parse(e.target.value))

  const debouncedHandleUpdateTextFilter = useCallback(
    debounce(text => {
      updateTextFilter(text)
    }, 300),
    []
  )

  useEffect(() => {
    debouncedHandleUpdateTextFilter(filterText)
  }, [filterText])

  const textFieldProps = {
    label: t('Location'),
    variant: 'filled',
    sx: {
      input: {
        color: 'white',
        fontSize: 14,
      },
      label: {
        color: 'white',
        fontSize: 14,
      },
      width: '100%',
    },
    value: filterText,
    onChange: handleChangeTextFilter,
  }

  const sortingFilterSelectProps = {
    sx: {
      color: 'white',
      fontSize: 14,
    },
    labelId: 'sorting-filter',
    value: JSON.stringify(allFilters.sorting),
    label: t('Sorting'),
    onChange: handleChangeEarthquakeSorting,
  }

  const sortingList = [
    {
      value: JSON.stringify({
        type: EARTHQUAKE_LIST_SORTING_TYPES.DATE,
        value: SORTING_TYPE_VALUES.ASC,
      }),
      text: t('Newest First'),
    },
    {
      value: JSON.stringify({
        type: EARTHQUAKE_LIST_SORTING_TYPES.DATE,
        value: SORTING_TYPE_VALUES.DESC,
      }),
      text: t('Oldest First'),
    },
    {
      value: JSON.stringify({
        type: EARTHQUAKE_LIST_SORTING_TYPES.MAG,
        value: SORTING_TYPE_VALUES.ASC,
      }),
      text: t('Largest Magnitude First'),
    },
    {
      value: JSON.stringify({
        type: EARTHQUAKE_LIST_SORTING_TYPES.MAG,
        value: SORTING_TYPE_VALUES.DESC,
      }),
      text: t('Smallest Magnitude First'),
    },
  ]

  return (
    <div className="earthquake-filters">
      <FormControl size="small">
        <InputLabel id="sorting-filter">{t('Sorting')}</InputLabel>
        <Select {...sortingFilterSelectProps}>
          {sortingList.map((item, key) => (
            <MenuItem key={key} value={item.value}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="earthquake-filters__search">
        <TextField {...textFieldProps} />
      </div>
    </div>
  )
}

export default EarthquakeFilters
