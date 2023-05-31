import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { FILTER_DEPTHS } from '../../../../../constants'
import { earthquakeActions } from '../../../../../store/earthquake'
import './index.css'

const DepthFilter = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const depth = useSelector(state => state.earthquake.earthquakeFilter.depth)

  const handleChange = e => {
    dispatch(earthquakeActions.setEarthquakeFilter({ depth: Number(e.target.value) }))
  }

  return (
    <div className="depth-filter">
      <FormControl fullWidth>
        <InputLabel id="depth-filter">{t('Depth')}</InputLabel>
        <Select
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
