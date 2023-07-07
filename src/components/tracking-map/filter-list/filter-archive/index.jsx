import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Button from '@mui/material/Button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { ARCHIVE_CERTAIN_TIMES } from '../../../../constants'
import constantsTestid from '../../../../constants/testid'
import useEarthquakeArchive from '../../../../hooks/useEarthquakeArchive'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../../../store/earthquake'
import { convertDateFormatForAPI } from '../../../../utils'
import dayjs from './../../../../utils/dayjs'
import './index.scss'

const FilterArchive = () => {
  const testid = constantsTestid.filterArchive
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { handleGetArchiveEarthquakes } = useEarthquakeArchive()

  const archiveDate = useSelector(state => state.earthquake.archiveDate)
  const selectedFilterItem = useSelector(isSelectedAnyArchiveItem)

  const clearArchiveDate = () => dispatch(earthquakeActions.clearArchiveDate())

  const handleCertainDate = async e => {
    const certainDate = e.target.value
    const params = {
      endDate: convertDateFormatForAPI(dayjs()),
      startDate: convertDateFormatForAPI(dayjs().add(-certainDate, 'days')),
    }

    dispatch(earthquakeActions.updateArchiveDate({ ...archiveDate, certainDate }))
    await handleGetArchiveEarthquakes(params)
  }

  const handleChooseDate = async (date, type) => {
    const convertedDate = convertDateFormatForAPI(date)
    const payload = { ...archiveDate, [type]: convertedDate }

    dispatch(earthquakeActions.updateArchiveDate(payload))
    if (payload.startDate && payload.endDate) await handleGetArchiveEarthquakes(payload)
  }

  return (
    <div data-testid={testid.container} className="filter-archive">
      <div className="filter-archive__certain-dates">
        <FormControl fullWidth>
          <InputLabel id="certain-date">{t('Time')}</InputLabel>
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
      <div className="filter-archive__or-text">{t('or')}</div>
      <div className="filter-archive__custom-dates">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            slotProps={{ textField: { size: 'small' } }}
            label={t('Start of Date')}
            className="filter-archive__custom-date-item"
            onChange={e => handleChooseDate(e, 'startDate')}
            value={archiveDate.startDate ? dayjs(archiveDate.startDate) : null}
            maxDate={archiveDate.endDate ? dayjs(archiveDate.endDate) : dayjs()}
          />
          <div className="filter-archive__hyphen">-</div>
          <MobileDatePicker
            slotProps={{ textField: { size: 'small' } }}
            label={t('End of Date')}
            className="filter-archive__custom-date-item"
            onChange={e => handleChooseDate(e, 'endDate')}
            value={archiveDate.endDate ? dayjs(archiveDate.endDate) : null}
            maxDate={dayjs()}
          />
        </LocalizationProvider>
      </div>
      {selectedFilterItem && (
        <div data-testid={testid.clearButton} onClick={clearArchiveDate} className="filter-archive__clear-filters">
          <Button className="filter-archive__clear-button" variant="contained" color="error">
            {t('REMOVE')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FilterArchive
