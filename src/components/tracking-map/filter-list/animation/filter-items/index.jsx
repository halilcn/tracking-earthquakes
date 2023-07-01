import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { ANIMATION_RANGES } from '../../../../../constants'
import constantsTestid from '../../../../../constants/testid'
import { earthquakeActions } from '../../../../../store/earthquake'
import dayjs from '../../../../../utils/dayjs'
import './index.scss'

const FilterItems = () => {
  const testid = constantsTestid.filterItems
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const animation = useSelector(state => state.earthquake.animation)

  const handleChangeAnimationFilters = (type, value) => dispatch(earthquakeActions.setAnimationFilter({ [type]: value }))

  return (
    <div data-testid={testid.container} className="animation-filters">
      <div className="animation-filters__item animation-filters__dates">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            slotProps={{ textField: { size: 'small' } }}
            label={t('Start of Date')}
            value={dayjs(animation.filters.startDate)}
            onChange={value => handleChangeAnimationFilters('startDate', value.startOf('day').format())}
            maxDate={dayjs(animation.filters.endDate).add(-1, 'day')}
          />
          <div className="animation-filters__hyphen">-</div>
          <MobileDatePicker
            slotProps={{ textField: { size: 'small' } }}
            label={t('End of Date')}
            value={dayjs(animation.filters.endDate)}
            onChange={value =>
              handleChangeAnimationFilters('endDate', dayjs().isSame(value, 'day') ? dayjs().format() : value.endOf('day').format())
            }
            maxDate={dayjs()}
            minDate={dayjs(animation.filters.startDate).add(1, 'day')}
          />
        </LocalizationProvider>
      </div>
      <div className="animation-filters__item">
        <FormControl fullWidth>
          <InputLabel id="animation-range">{t('Range')}</InputLabel>
          <Select
            size="small"
            labelId="animation-range"
            value={animation.filters.range}
            label={t('Range')}
            onChange={e => handleChangeAnimationFilters('range', e.target.value)}>
            {Object.keys(ANIMATION_RANGES).map((range, key) => (
              <MenuItem key={key} value={range}>
                {ANIMATION_RANGES[range]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  )
}

export default FilterItems
