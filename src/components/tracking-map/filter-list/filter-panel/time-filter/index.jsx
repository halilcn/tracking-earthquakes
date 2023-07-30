import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { FILTER_TIME } from '../../../../../constants'
import constantsTestid from '../../../../../constants/testid'
import { earthquakeActions } from '../../../../../store/earthquake'
import { changeURL } from '../../../../../utils'
import { URL_QUERY_PARAMS, updateEarthquakeQueryParams } from '../../../../../utils/queryParamsActions'
import './index.scss'

const TimeFilter = () => {
  const testid = constantsTestid.timeFilter
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const time = useSelector(state => state.earthquake.earthquakeFilter.time)

  const handleSetTimeParam = value => {
    const url = updateEarthquakeQueryParams({ key: URL_QUERY_PARAMS.TIME, value })
    changeURL(url)
  }

  const handleChange = event => {
    const value = Number(event.target.value)
    dispatch(earthquakeActions.setEarthquakeFilter({ time: value }))
    handleSetTimeParam(value)
  }
  return (
    <div data-testid={testid.timeContainer} className="time-filter">
      <FormControl fullWidth>
        <InputLabel id="time-filter">{t('Time')}</InputLabel>
        <Select size="small" className="time-filter__select" labelId="time-filter" value={time} label={t('Time')} onChange={handleChange}>
          {Object.keys(FILTER_TIME).map((time, index) => (
            <MenuItem key={index} value={time}>
              {FILTER_TIME[time]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default TimeFilter
