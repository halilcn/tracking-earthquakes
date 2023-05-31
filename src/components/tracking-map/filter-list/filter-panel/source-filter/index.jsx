import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { SOURCES } from '../../../../../constants'
import { earthquakeActions } from '../../../../../store/earthquake'
import './index.scss'

const SourceFilter = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const earthquakeSources = useSelector(state => state.earthquake.earthquakeFilter.sources)

  const handleChange = event => dispatch(earthquakeActions.setEarthquakeFilter({ sources: event.target.value }))

  return (
    <div className="source-filter">
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
