import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Button from '@mui/material/Button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CiCircleInfo } from 'react-icons/ci'
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

const datePickerSlotProps = { textField: { size: 'small' } }

const MAX_DAYS_BETWEEN_ARCHIVE_DAYS = 60

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

  const handleChooseDate = type => async date => {
    const convertedDate = convertDateFormatForAPI(date)
    const isStartDateType = type === ARCHIVE_DATE_FIELDS.START_DATE
    const otherDateType = isStartDateType ? ARCHIVE_DATE_FIELDS.END_DATE : ARCHIVE_DATE_FIELDS.START_DATE
    const payload = { [otherDateType]: archiveDate[otherDateType], [type]: convertedDate }

    const isSelectedMoreThanMaxDays =
      isStartDateType &&
      payload[ARCHIVE_DATE_FIELDS.END_DATE] &&
      dayjs(payload[ARCHIVE_DATE_FIELDS.START_DATE])
        .add(MAX_DAYS_BETWEEN_ARCHIVE_DAYS, 'days')
        .isBefore(dayjs(payload[ARCHIVE_DATE_FIELDS.END_DATE]))
    if (isSelectedMoreThanMaxDays) payload[ARCHIVE_DATE_FIELDS.END_DATE] = null

    handleUpdateArchiveDate(payload)
    if (payload[ARCHIVE_DATE_FIELDS.START_DATE] && payload[ARCHIVE_DATE_FIELDS.END_DATE]) {
      handleSetArchiveDataParam(payload)
      await handleGetArchiveEarthquakes(payload)
    }
  }

  const handleClearButton = () => {
    handleUpdateArchiveDate()
    handleDeleteArchiveDataParam()
  }

  const getArchiveDateValue = type => (archiveDate[type] ? dayjs(archiveDate[type]) : null)

  const getEndPickerMaxDate = () => {
    if (!archiveDate[ARCHIVE_DATE_FIELDS.START_DATE]) return dayjs()

    const endPickerMaxDate = dayjs(archiveDate[ARCHIVE_DATE_FIELDS.START_DATE]).add(MAX_DAYS_BETWEEN_ARCHIVE_DAYS, 'days')
    const isInTheNextDays = dayjs().isBefore(endPickerMaxDate)
    if (isInTheNextDays) return dayjs()

    return endPickerMaxDate
  }
  const endPickerMinDate = dayjs(archiveDate[ARCHIVE_DATE_FIELDS.START_DATE])
  const startPickerMaxDate = archiveDate[ARCHIVE_DATE_FIELDS.END_DATE] ? dayjs(archiveDate[ARCHIVE_DATE_FIELDS.END_DATE]) : dayjs()

  return (
    <div data-testid={testid.container} className="filter-archive">
      <div className="filter-archive__certain-dates">
        <FormControl fullWidth>
          <InputLabel id="certain-date">{t('Time')}</InputLabel>
          <Select
            label={t('Time')}
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
            slotProps={datePickerSlotProps}
            label={t('Start of Date')}
            className="filter-archive__custom-date-item"
            onChange={handleChooseDate(ARCHIVE_DATE_FIELDS.START_DATE)}
            value={getArchiveDateValue(ARCHIVE_DATE_FIELDS.START_DATE)}
            maxDate={startPickerMaxDate}
          />
          <div className="filter-archive__hyphen">-</div>
          <MobileDatePicker
            slotProps={datePickerSlotProps}
            label={t('End of Date')}
            className="filter-archive__custom-date-item"
            onChange={handleChooseDate(ARCHIVE_DATE_FIELDS.END_DATE)}
            value={getArchiveDateValue(ARCHIVE_DATE_FIELDS.END_DATE)}
            maxDate={getEndPickerMaxDate()}
            minDate={endPickerMinDate}
          />
        </LocalizationProvider>
      </div>
      <div className="filter-archive__custom-dates-info">
        <CiCircleInfo size={15} />
        <div className="filter-archive__custom-dates-info-text">{t('Maximum of 2 months date range can be selected')}</div>
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
