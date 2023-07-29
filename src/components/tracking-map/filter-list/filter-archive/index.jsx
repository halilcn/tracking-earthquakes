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
import { handleEarthquakesKandilli, handleEarthquakesUsgs } from '../../../../service/earthquakes'
import { defaultEarthquakeArchiveDateState, earthquakeActions, isSelectedAnyArchiveItem } from '../../../../store/earthquake'
import { changeURL, convertDateFormatForAPI } from '../../../../utils'
import { deletePastEarthquakeDatesQueryParam, setPastEarthquakeDatesQueryParam } from '../../../../utils/queryParamsActions'
import dayjs from './../../../../utils/dayjs'
import './index.scss'

const ARCHIVE_DATE_FIELDS = {
  START_DATE: 'startDate',
  END_DATE: 'endDate',
}

const handleSetArchiveDataParam = dates => {
  const url = setPastEarthquakeDatesQueryParam(dates)
  changeURL(url)
}

const handleDeleteArchiveDataParam = () => {
  const url = deletePastEarthquakeDatesQueryParam()
  changeURL(url)
}

const FilterArchive = () => {
  const testid = constantsTestid.filterArchive
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const archiveDate = useSelector(state => state.earthquake.archiveDate)
  const selectedFilterItem = useSelector(isSelectedAnyArchiveItem)

  const handleUpdateArchiveDate = (payload = {}) =>
    dispatch(earthquakeActions.updateArchiveDate({ ...defaultEarthquakeArchiveDateState, ...payload }))

  const handleCertainDate = async e => {
    const certainDate = e.target.value
    const params = {
      endDate: convertDateFormatForAPI(dayjs()),
      startDate: convertDateFormatForAPI(dayjs().add(-certainDate, 'days')),
    }

    handleUpdateArchiveDate({ certainDate })
    await handleGetArchiveEarthquakes(params)
    handleSetArchiveDataParam(params)
  }

  const handleArchiveEarthquakesKandilli = async params => {
    const preparedEarthquakesData = await handleEarthquakesKandilli(params)
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  const handleArchiveEarthquakesUsgs = async params => {
    const preparedEarthquakesData = await handleEarthquakesUsgs(params)
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  const handleGetArchiveEarthquakes = async params => {
    try {
      dispatch(earthquakeActions.setIsLoadingData(true))
      dispatch(earthquakeActions.setEarthquakes([]))
      await Promise.all([handleArchiveEarthquakesKandilli(params), handleArchiveEarthquakesUsgs(params)])
    } catch (err) {
      alert(t('Occurred a problem'))
    } finally {
      dispatch(earthquakeActions.setIsLoadingData(false))
    }
  }

  const handleChooseDate = async (date, type) => {
    const convertedDate = convertDateFormatForAPI(date)
    const otherDateType = type === ARCHIVE_DATE_FIELDS.START_DATE ? ARCHIVE_DATE_FIELDS.END_DATE : ARCHIVE_DATE_FIELDS.START_DATE
    const payload = { [otherDateType]: archiveDate[otherDateType], [type]: convertedDate }

    handleUpdateArchiveDate(payload)
    if (payload[ARCHIVE_DATE_FIELDS.START_DATE] && payload[ARCHIVE_DATE_FIELDS.END_DATE]) {
      await handleGetArchiveEarthquakes(payload)
      handleSetArchiveDataParam()
    }
  }

  const handleClearButton = () => {
    handleUpdateArchiveDate()
    handleDeleteArchiveDataParam()
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
            onChange={e => handleChooseDate(e, ARCHIVE_DATE_FIELDS.START_DATE)}
            value={archiveDate[ARCHIVE_DATE_FIELDS.START_DATE] ? dayjs(archiveDate[ARCHIVE_DATE_FIELDS.START_DATE]) : null}
            maxDate={archiveDate[ARCHIVE_DATE_FIELDS.END_DATE] ? dayjs(archiveDate[ARCHIVE_DATE_FIELDS.END_DATE]) : dayjs()}
          />
          <div className="filter-archive__hyphen">-</div>
          <MobileDatePicker
            slotProps={{ textField: { size: 'small' } }}
            label={t('End of Date')}
            className="filter-archive__custom-date-item"
            onChange={e => handleChooseDate(e, ARCHIVE_DATE_FIELDS.END_DATE)}
            value={archiveDate[ARCHIVE_DATE_FIELDS.END_DATE] ? dayjs(archiveDate[ARCHIVE_DATE_FIELDS.END_DATE]) : null}
            maxDate={dayjs()}
          />
        </LocalizationProvider>
      </div>
      {selectedFilterItem && (
        <div data-testid={testid.clearButton} onClick={handleClearButton} className="filter-archive__clear-filters">
          <Button className="filter-archive__clear-button" variant="contained" color="error">
            {t('REMOVE')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FilterArchive
