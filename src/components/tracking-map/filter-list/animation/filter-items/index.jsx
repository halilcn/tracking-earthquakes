import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import dayjs from '../../../../../utils/dayjs'

import './index.scss'

const FilterItems = () => {
  const { t } = useTranslation()

  /*
                onChange={e => handleChooseDate(e, 'startDate')}
              value={archiveDate.startDate ? dayjs(archiveDate.startDate) : null}
              maxDate={archiveDate.endDate ? dayjs(archiveDate.endDate) : dayjs()}

  */

  return (
    <div className="animation-filters">
      <div className="animation-filters__item animation-filters__dates">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker slotProps={{ textField: { size: 'small' } }} label={t('Start of Date')} className="" value={dayjs()} />
          <div className="filter-archive__hyphen">-</div>
          <MobileDatePicker slotProps={{ textField: { size: 'small' } }} label={t('End of Date')} className="" value={dayjs()} />
        </LocalizationProvider>
      </div>
      <div className="animation-filters__item">
        <FormControl fullWidth>
          <InputLabel id="map-type">{t('Type of Map')}</InputLabel>
          <Select size="small" className="map-type__select" labelId="map-type" value={''} label={t('Type of Map')} onChange={() => {}}>
            {[1, 2, 4].map((type, key) => (
              <MenuItem key={key} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  )
}

export default FilterItems
