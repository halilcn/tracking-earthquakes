import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useEffect, useState } from 'react'
import { ARCHIVE_CERTAIN_TIMES } from '../../../../constants'
import { getArchiveEarthquakes } from '../../../../api'

import './index.scss'
import { prepareEarthquake } from '../../../../utils'
import { useDispatch } from 'react-redux'
import { earthquakeActions } from '../../../../store/earthquake'
import dayjs from 'dayjs'

const FilterArchive = () => {
  const dispatch = useDispatch()

  const [certainDate, setCertainDate] = useState(3)

  const handleCertainDate = async e => {
    const certainBackDay = e.target.value
    const params = {
      date_end: dayjs().format('YYYY-MM-DD'),
      date: dayjs().add(-certainBackDay, 'days').format('YYYY-MM-DD'),
    }

    setCertainDate(certainBackDay)

    const earthquakeResult = (await getArchiveEarthquakes(params)).result
    const preparedEarthquakesData = earthquakeResult.map(earthquake => prepareEarthquake(earthquake))
    dispatch(earthquakeActions.setEarthquakes(preparedEarthquakesData))
  }

  const handleGetData = async () => {
    const test = await getArchiveEarthquakes()
  }

  useEffect(() => {
    handleGetData()
  }, [])

  return (
    <div className="filter-archive">
      <div className="filter-archive__certain-dates">
        <Select
          className="filter-archive__certain-date-input"
          labelId="map-type"
          value={certainDate}
          label="test"
          onChange={handleCertainDate}>
          {Object.keys(ARCHIVE_CERTAIN_TIMES).map((time, key) => (
            <MenuItem key={key} value={time}>
              {ARCHIVE_CERTAIN_TIMES[time]}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="filter-archive__or-text">ya da</div>
      <div className="filter-archive__custom-dates">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Başlangıç Tarihi" className="filter-archive__custom-date-item" />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Bitiş Tarihi" className="filter-archive__custom-date-item" />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default FilterArchive
