import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Button from '@mui/material/Button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { getEarthquakesInWorld } from '../../../../api'
import { ARCHIVE_CERTAIN_TIMES } from '../../../../constants'
import { getAllEarthquakesByUsingKandilliAPI } from '../../../../service/earthquakes'
import { earthquakeActions, isSelectedAnyArchiveItem } from '../../../../store/earthquake'
import { convertDateFormatForAPI, prepareEarthquakeKandilli, prepareEarthquakeUsgs } from '../../../../utils'
import dayjs from './../../../../utils/dayjs'
import './index.scss'

const FilterArchive = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

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

  const handleEarthquakesInTurkey = async params => {
    const requestParams = { date_end: params.endDate, date: params.startDate }
    const allEarthquakes = await getAllEarthquakesByUsingKandilliAPI(requestParams)
    const preparedEarthquakesData = allEarthquakes.map(earthquake => prepareEarthquakeKandilli(earthquake))
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  const handleEarthquakesInWorld = async params => {
    const requestParams = {
      endtime: params.endDate,
      starttime: params.startDate,
    }
    const { features } = await getEarthquakesInWorld(requestParams)
    const preparedEarthquakesData = features.map(earthquake => prepareEarthquakeUsgs(earthquake))
    dispatch(earthquakeActions.addEarthquakes(preparedEarthquakesData))
  }

  const handleGetArchiveEarthquakes = async params => {
    try {
      dispatch(earthquakeActions.setIsLoadingData(true))
      dispatch(earthquakeActions.setEarthquakes([]))
      await Promise.all([handleEarthquakesInTurkey(params), handleEarthquakesInWorld(params)])
    } catch (err) {
      alert(t('Occurred a problem'))
    } finally {
      dispatch(earthquakeActions.setIsLoadingData(false))
    }
  }

  const handleChooseDate = async (date, type) => {
    const convertedDate = convertDateFormatForAPI(date)
    const payload = { ...archiveDate, [type]: convertedDate }

    dispatch(earthquakeActions.updateArchiveDate(payload))
    if (payload.startDate && payload.endDate) await handleGetArchiveEarthquakes(payload)
  }

  return (
    <div className="filter-archive">
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
        <div onClick={clearArchiveDate} className="filter-archive__clear-filters">
          <Button className="filter-archive__clear-button" variant="contained" color="error">
            {t('REMOVE')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FilterArchive
