import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { SOURCES } from '../../../../../constants'
import constantsTestid from '../../../../../constants/testid'
import { earthquakeActions } from '../../../../../store/earthquake'
import { changeURL } from '../../../../../utils'
import { URL_QUERY_PARAMS, updateEarthquakeQueryParams } from '../../../../../utils/queryParamsActions'
import './index.scss'

const SourceFilter = () => {
  const testid = constantsTestid.sourceFilter
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const earthquakeSources = useSelector(state => state.earthquake.earthquakeFilter.sources)

  const handleSetSourcesParam = value => {
    const url = updateEarthquakeQueryParams({ key: URL_QUERY_PARAMS.SOURCES, value })
    changeURL(url)
  }

  const handleChange = event => {
    const value = event.target.value
    dispatch(earthquakeActions.setEarthquakeFilter({ sources: value }))
    handleSetSourcesParam(value)
  }

  return (
    <div data-testid={testid.sourceContainer} className="source-filter">
      <FormControl className="source-filter__container">
        <InputLabel size="small" id="source-filter-label">
          {t('Sources')}
        </InputLabel>
        <Select
          labelId="source-filter-label"
          label={t('Sources')}
          value={earthquakeSources}
          onChange={handleChange}
          renderValue={selected => selected.join(', ')}
          size="small"
          multiple>
          {Object.values(SOURCES).map(source => (
            <MenuItem key={source} value={source}>
              <Checkbox checked={earthquakeSources.includes(source)} />
              <ListItemText primary={source} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default SourceFilter
