import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_MAGNITUDE } from '../../../../../constants'
import { earthquakeActions } from '../../../../../store/earthquake'
import { useTranslation } from 'react-i18next'

import './index.scss'

const MagnitudeFilter = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const magnitudeFilter = useSelector(state => state.earthquake.earthquakeMagnitudeFilter)

  const handleChange = event => {
    const magnitudeFilterValue = event.target.value
    dispatch(earthquakeActions.setEarthquakeMagnitudeFilter(magnitudeFilterValue))
  }

  return (
    <div className="magnitude-filter">
      <FormControl fullWidth>
        <InputLabel id="magnitude-filter">{t('Magnitude')}</InputLabel>
        <Select
          className="magnitude-filter__select"
          labelId="magnitude-filter"
          value={magnitudeFilter}
          label={t('Magnitude')}
          size="small"
          onChange={handleChange}>
          {Object.keys(FILTER_MAGNITUDE).map((magnitude, key) => (
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
