import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_TIME } from '../../../../constants'
import { earthquakeActions } from '../../../../store/earthquake'

import './index.scss'

const TimeFilter = () => {
  const dispatch = useDispatch()
  const earthquakeTimeFilter = useSelector(state => state.earthquake.earthquakeTimeFilter)

  const handleChange = event => {
    const timeFilterValue = event.target.value
    dispatch(earthquakeActions.setEarthquakeTimeFilter(timeFilterValue))
  }
  return (
    <div className="time-filter">
      <FormControl style={{ width: 130, zIndex: 1 }}>
        <InputLabel id="time-filter">Zaman</InputLabel>
        <Select labelId="time-filter" value={earthquakeTimeFilter} label="Zaman" onChange={handleChange}>
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
