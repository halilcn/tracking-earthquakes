import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useEffect, useState } from 'react'
import { ARCHIVE_CERTAIN_TIMES } from '../../../../constants'
import { getArchiveEarthquakes, getEarthquakes } from '../../../../api'

import './index.scss'
import { prepareEarthquake } from '../../../../utils'
import { useDispatch } from 'react-redux'
import { earthquakeActions } from '../../../../store/earthquake'
import dayjs from 'dayjs'

const FilterArchive = () => {
  const dispatch = useDispatch()

  const [certainDate, setCertainDate] = useState(0)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const convertDateFormat = date => date.format('YYYY-MM-DD')

  const handleCertainDate = async e => {
    const certainBackDay = e.target.value
    const params = {
      date_end: convertDateFormat(dayjs()),
      date: convertDateFormat(dayjs().add(-certainBackDay, 'days')),
    }

    setCertainDate(certainBackDay)

    await handleArchiveEarthquakes(params)
  }

  const handleArchiveEarthquakes = async params => {
    dispatch(earthquakeActions.setIsLoadingData(true))
    const earthquakeResult = (await getArchiveEarthquakes(params)).result
    const preparedEarthquakesData = earthquakeResult.map(earthquake => prepareEarthquake(earthquake))
    dispatch(earthquakeActions.setEarthquakes(preparedEarthquakesData))
    dispatch(earthquakeActions.setIsLoadingData(false))
  }

  const handleStartDate = async date => {
    const startDate = convertDateFormat(date)
    setStartDate(startDate)
    if (endDate) await handleArchiveEarthquakes({ date_end: endDate, date: startDate })
  }

  const handleEndDate = async date => {
    const endDate = convertDateFormat(date)
    setEndDate(endDate)
    if (startDate) await handleArchiveEarthquakes({ date_end: endDate, date: startDate })
  }

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
          <DatePicker label="Başlangıç Tarihi" className="filter-archive__custom-date-item" onChange={handleStartDate} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Bitiş Tarihi" className="filter-archive__custom-date-item" onChange={handleEndDate} />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default FilterArchive
