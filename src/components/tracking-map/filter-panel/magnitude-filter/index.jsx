import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_MAGNITUDE } from '../../../../constants'
import { earthquakeActions } from '../../../../store/earthquake'

import './index.scss'

const MagnitudeFilter = () => {
  const dispatch = useDispatch()
  const magnitudeFilter = useSelector(state => state.earthquake.earthquakeMagnitudeFilter)

  const handleChange = event => {
    const magnitudeFilterValue = event.target.value
    dispatch(earthquakeActions.setEarthquakeMagnitudeFilter(magnitudeFilterValue))
  }

  return (
    <div className="magnitude-filter">
      <FormControl style={{ width: 130, zIndex: 1 }}>
        <InputLabel id="magnitude-filter">Büyüklük</InputLabel>
        <Select
          className="magnitude-filter__select"
          labelId="magnitude-filter"
          value={magnitudeFilter}
          label="Büyüklük"
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
