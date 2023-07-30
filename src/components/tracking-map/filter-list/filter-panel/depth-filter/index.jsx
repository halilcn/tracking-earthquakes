import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { FILTER_DEPTHS } from '../../../../../constants'
import constantsTestid from '../../../../../constants/testid'
import { earthquakeActions } from '../../../../../store/earthquake'
import { changeURL } from '../../../../../utils'
import { URL_QUERY_PARAMS, updateEarthquakeQueryParams } from '../../../../../utils/queryParamsActions'
import './index.css'

const DepthFilter = () => {
  const testid = constantsTestid.depthFilter
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const depth = useSelector(state => state.earthquake.earthquakeFilter.depth)

  const handleSetDepthParam = value => {
    const url = updateEarthquakeQueryParams({ key: URL_QUERY_PARAMS.DEPTH, value })
    changeURL(url)
  }

  const handleChange = e => {
    const value = Number(e.target.value)
    dispatch(earthquakeActions.setEarthquakeFilter({ depth: value }))
    handleSetDepthParam(value)
  }

  return (
    <div data-testid={testid.depthContainer} className="depth-filter">
      <FormControl fullWidth>
        <InputLabel id="depth-filter">{t('Depth')}</InputLabel>
        <Select
          data-testid={testid.select}
          className="depth-filter__select"
          labelId="depth-filter"
          value={depth}
          label={t('Depth')}
          size="small"
          onChange={handleChange}>
          {Object.keys(FILTER_DEPTHS)
            .sort((a, b) => a - b)
            .map((depth, key) => (
              <MenuItem key={key} value={depth}>
                {FILTER_DEPTHS[depth]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default DepthFilter
