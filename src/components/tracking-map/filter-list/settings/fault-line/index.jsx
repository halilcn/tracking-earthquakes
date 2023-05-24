import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions } from '../../../../../store/earthquake'
import { setFaultLineActive } from '../../../../../utils/localStorageActions'
import { useTranslation } from 'react-i18next'

import './index.scss'

const FaultLine = () => {
  const faultLineActive = useSelector(state => state.earthquake.faultLineActive)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleChange = e => {
    const currentStatus = e.currentTarget.checked
    dispatch(earthquakeActions.setFaultLineActive(currentStatus))
    setFaultLineActive(currentStatus)
  }

  return (
    <div>
      <FormGroup>
        <FormControlLabel label={t('Fault Line Active')} control={<Checkbox checked={faultLineActive} onChange={handleChange} />} />
      </FormGroup>
    </div>
  )
}

export default FaultLine
