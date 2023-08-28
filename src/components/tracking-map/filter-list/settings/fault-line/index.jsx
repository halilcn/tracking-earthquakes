import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { earthquakeActions } from '../../../../../store/earthquake'
import { setFaultLineActive } from '../../../../../utils/localStorageActions'
import './index.scss'

const FaultLine = () => {
  const isEnabledFaultLine = useSelector(state => state.earthquake.settings.isEnabledFaultLine)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleChange = e => {
    const currentStatus = e.currentTarget.checked
    dispatch(earthquakeActions.updateSettings({ isEnabledFaultLine: currentStatus }))
    setFaultLineActive(currentStatus)
  }

  return (
    <div>
      <FormGroup>
        <FormControlLabel label={t('Fault Line Active')} control={<Checkbox checked={isEnabledFaultLine} onChange={handleChange} />} />
      </FormGroup>
    </div>
  )
}

export default FaultLine
