import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { earthquakeActions } from '../../../../../store/earthquake'
import { setPopulationDensityActive } from '../../../../../utils/localStorageActions'

const PopulationDensity = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const isEnabledPopulationDensity = useSelector(state => state.earthquake.settings.isEnabledPopulationDensity)

  const handleChange = e => {
    const currentStatus = e.currentTarget.checked
    dispatch(earthquakeActions.updateSettings({ isEnabledPopulationDensity: currentStatus }))
    setPopulationDensityActive(currentStatus)
  }

  return (
    <div>
      <FormGroup>
        <FormControlLabel
          label={t('Population Density')}
          control={<Checkbox checked={isEnabledPopulationDensity} onChange={handleChange} />}
        />
      </FormGroup>
    </div>
  )
}

export default PopulationDensity
