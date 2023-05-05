import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { earthquakeActions } from '../../../../../store/earthquake'
import { FILTER_DEPTHS } from '../../../../../constants'
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'

import './index.css'

const DepthFilter = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const earthquakeDepthFilter = useSelector(state => state.earthquake.earthquakeDepthFilter)

  const handleChange = e => {
    dispatch(earthquakeActions.setEarthquakeDepthFilter(e.target.value))
  }

  return (
    <div className="depth-filter">
      <FormControl fullWidth>
        <InputLabel id="depth-filter">{t('Depth')}</InputLabel>
        <Select
          className="depth-filter__select"
          labelId="depth-filter"
          value={earthquakeDepthFilter}
          label={t('Depth')}
          size="small"
          onChange={handleChange}>
          {Object.keys(FILTER_DEPTHS).map((depth, key) => (
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
