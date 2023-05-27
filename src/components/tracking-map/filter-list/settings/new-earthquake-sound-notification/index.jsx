import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions } from '../../../../../store/earthquake'
import { setNewEarthquakeSoundNotification } from '../../../../../utils/localStorageActions'
import { useTranslation } from 'react-i18next'

import './index.scss'

const newEarthquakeSoundNotification = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const newEarthquakeSound = useSelector(state => state.earthquake.earthquakeNotification.newEarthquakeSound)

  const handleChange = e => {
    const currentCheckedStatus = e.currentTarget.checked
    setNewEarthquakeSoundNotification(currentCheckedStatus)
    dispatch(earthquakeActions.setEarthquakeNotification({ newEarthquakeSound: currentCheckedStatus }))
  }

  return (
    <div>
      <FormGroup>
        <FormControlLabel
          label={t('Warn with sound when a new earthquake occurs')}
          control={<Checkbox checked={newEarthquakeSound} onChange={handleChange} />}
        />
      </FormGroup>
    </div>
  )
}

export default newEarthquakeSoundNotification
