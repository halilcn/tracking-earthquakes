import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import { ARCHIVE_CERTAIN_TIMES } from '../../../../constants'
import { getArchiveEarthquakes, getEarthquakes } from '../../../../api'

import './index.scss'
import { isNull, prepareEarthquake } from '../../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions } from '../../../../store/earthquake'
import dayjs from 'dayjs'

const FilterArchive = () => {
  const dispatch = useDispatch()

  const archiveDate = useSelector(state => state.earthquake.archiveDate)
  const isSelectedAnyFilterItem = !isNull(Object.values(archiveDate))

  const clearArchiveDate = () => {
    dispatch(earthquakeActions.updateArchiveDate({ certainDate: null, startDate: null, endDate: null }))
    // live data TODO:
  }

  const convertDateFormat = date => date.format('YYYY-MM-DD')

  const handleCertainDate = async e => {
    const certainBackDay = e.target.value
    const params = {
      date_end: convertDateFormat(dayjs()),
      date: convertDateFormat(dayjs().add(-certainBackDay, 'days')),
    }

    dispatch(earthquakeActions.updateArchiveDate({ ...archiveDate, certainDate: certainBackDay }))
    //setCertainDate(certainBackDay)

    await handleArchiveEarthquakes(params)
  }

  const handleArchiveEarthquakes = async params => {
    try {
      //TODO: REFACTOR

      dispatch(earthquakeActions.setIsLoadingData(true))

      let test = []
      let skipParam = 0

      while (true) {
        const responseEarthquake = await getArchiveEarthquakes({ ...params, skip: test.length })
        test = [...test, ...responseEarthquake.result]

        console.log('responseEarthquake', responseEarthquake)
        console.log('responseEarthquake.metadata.total', responseEarthquake.metadata.total)
        console.log('test.lenght', test.lenght)

        if (responseEarthquake.metadata.total - 5 < test.length) {
          break
        }

        console.log('sonsuz')
      }

      console.log('test', test)

      const preparedEarthquakesData = test.map(earthquake => prepareEarthquake(earthquake))

      dispatch(earthquakeActions.setEarthquakes(preparedEarthquakesData))
    } catch (e) {
      console.log('e', e)
      alert('Bir hata meydana geldi!')
    } finally {
      dispatch(earthquakeActions.setIsLoadingData(false))
    }
  }

  const handleStartDate = async date => {
    const startDate = convertDateFormat(date)
    dispatch(earthquakeActions.updateArchiveDate({ ...archiveDate, startDate }))

    if (archiveDate.endDate) await handleArchiveEarthquakes({ date_end: archiveDate.endDate, date: startDate })
  }

  const handleEndDate = async date => {
    const endDate = convertDateFormat(date)
    dispatch(earthquakeActions.updateArchiveDate({ ...archiveDate, endDate }))
    if (archiveDate.startDate) await handleArchiveEarthquakes({ date_end: endDate, date: archiveDate.startDate })
  }

  return (
    <div className="filter-archive">
      <div className="filter-archive__certain-dates">
        <Select
          className="filter-archive__certain-date-input"
          labelId="map-type"
          value={archiveDate.certainDate || 0}
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
      {isSelectedAnyFilterItem && (
        <div onClick={clearArchiveDate} className="filter-archive__clear-filters">
          <Button className="filter-archive__clear-button" variant="contained" color="error">
            TEMİZLE
          </Button>
        </div>
      )}
    </div>
  )
}

export default FilterArchive
