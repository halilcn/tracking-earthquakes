import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_TIME } from '../../../../../constants'
import { earthquakeActions } from '../../../../../store/earthquake'
import { useTranslation } from 'react-i18next'

import './index.scss'

const TimeFilter = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const earthquakeTimeFilter = useSelector(state => state.earthquake.earthquakeTimeFilter)

  const handleChange = event => {
    const timeFilterValue = event.target.value
    dispatch(earthquakeActions.setEarthquakeTimeFilter(timeFilterValue))
  }
  return (
    <div className="time-filter">
      <FormControl fullWidth>
        <InputLabel id="time-filter">{t('Time')}</InputLabel>
        <Select
          size="small"
          className="time-filter__select"
          labelId="time-filter"
          value={earthquakeTimeFilter}
          label={t('Time')}
          onChange={handleChange}>
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
