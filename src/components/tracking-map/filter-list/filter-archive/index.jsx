import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Button from '@mui/material/Button'
import { ARCHIVE_CERTAIN_TIMES } from '../../../../constants'
import { getArchiveEarthquakes } from '../../../../api'
import { prepareEarthquake } from '../../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../../../store/earthquake'
import dayjs from 'dayjs'

import './index.scss'

const FilterArchive = () => {
  const dispatch = useDispatch()

  const archiveDate = useSelector(state => state.earthquake.archiveDate)
  const selectedFilterItem = useSelector(isSelectedAnyArchiveItem)

  const clearArchiveDate = () => dispatch(earthquakeActions.clearArchiveDate())
  const convertDateFormat = date => date.format('YYYY-MM-DD')

  const handleCertainDate = async e => {
    const certainDate = e.target.value
    const params = {
      date_end: convertDateFormat(dayjs()),
      date: convertDateFormat(dayjs().add(-certainDate, 'days')),
    }

    dispatch(earthquakeActions.updateArchiveDate({ ...archiveDate, certainDate }))

    await handleArchiveEarthquakes(params)
  }

  const handleArchiveEarthquakes = async params => {
    try {
      dispatch(earthquakeActions.setIsLoadingData(true))

      const allEarthquakes = []
      while (true) {
        const responseEarthquakes = await getArchiveEarthquakes({ ...params, skip: allEarthquakes.length })
        allEarthquakes.push(...responseEarthquakes.result)

        if (responseEarthquakes.metadata.total - 1 < allEarthquakes.length) break
      }

      const preparedEarthquakesData = allEarthquakes.map(earthquake => prepareEarthquake(earthquake))
      dispatch(earthquakeActions.setEarthquakes(preparedEarthquakesData))
    } catch (err) {
      alert('Bir hata meydana geldi...')
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
        <FormControl fullWidth>
          <InputLabel id="certain-date">Zaman</InputLabel>
          <Select
            size="small"
            className="filter-archive__certain-date-input"
            value={archiveDate.certainDate || 0}
            labelId="certain-date"
            onChange={handleCertainDate}>
            {Object.keys(ARCHIVE_CERTAIN_TIMES).map((time, key) => (
              <MenuItem key={key} value={time}>
                {ARCHIVE_CERTAIN_TIMES[time]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="filter-archive__or-text">ya da</div>
      <div className="filter-archive__custom-dates">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: 'small' } }}
            label="Başlangıç Tarihi"
            className="filter-archive__custom-date-item"
            onChange={handleStartDate}
            value={archiveDate.startDate ? dayjs(archiveDate.startDate) : null}
            maxDate={archiveDate.endDate ? dayjs(archiveDate.endDate) : dayjs()}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: 'small' } }}
            label="Bitiş Tarihi"
            className="filter-archive__custom-date-item"
            onChange={handleEndDate}
            value={archiveDate.endDate ? dayjs(archiveDate.endDate) : null}
            maxDate={dayjs()}
          />
        </LocalizationProvider>
      </div>
      {selectedFilterItem && (
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
