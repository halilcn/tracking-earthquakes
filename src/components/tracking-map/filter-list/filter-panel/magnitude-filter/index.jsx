import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { FILTER_MAGNITUDE } from '../../../../../constants'
import constantsTestid from '../../../../../constants/testid'
import { earthquakeActions } from '../../../../../store/earthquake'
import './index.scss'

const MagnitudeFilter = () => {
  const testid = constantsTestid.magnitudeFilter
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const magnitude = useSelector(state => state.earthquake.earthquakeFilter.magnitude)

  const handleChange = event => {
    dispatch(earthquakeActions.setEarthquakeFilter({ magnitude: event.target.value }))
  }

  return (
    <div data-testid={testid.magnitudeContainer} className="magnitude-filter">
      <FormControl fullWidth>
        <InputLabel id="magnitude-filter">{t('Magnitude')}</InputLabel>
        <Select
          className="magnitude-filter__select"
          labelId="magnitude-filter"
          value={magnitude}
          label={t('Magnitude')}
          size="small"
          onChange={handleChange}>
          {Object.keys(FILTER_MAGNITUDE)
            .sort((a, b) => a - b)
            .map((magnitude, key) => (
              <MenuItem key={key} value={magnitude}>
                {FILTER_MAGNITUDE[magnitude]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default MagnitudeFilter
