import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { MAPBOX_SOURCES, SOURCE_COLOR_DISABLE_VALUE, SOURCE_COLOR_ENABLE_VALUE } from '../../../../../constants'
import { earthquakeActions } from '../../../../../store/earthquake'
import { setSourceColorActive } from '../../../../../utils/localStorageActions'

const SourceColor = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { sourceColorActive, mapCurrent } = useSelector(state => ({
    sourceColorActive: state.earthquake.sourceColorActive,
    mapCurrent: state.earthquake.mapCurrent,
  }))

  const handleChange = e => {
    const currentValue = e.currentTarget.checked

    dispatch(earthquakeActions.setSourceColorActive(currentValue))
    setSourceColorActive(currentValue)

    mapCurrent.setPaintProperty(
      MAPBOX_SOURCES.LAYER_DATA_CIRCLE,
      'circle-stroke-width',
      currentValue ? SOURCE_COLOR_ENABLE_VALUE : SOURCE_COLOR_DISABLE_VALUE
    )
  }

  return (
    <div>
      <FormGroup>
        <FormControlLabel label={t('Earthquake Source Color')} control={<Checkbox checked={sourceColorActive} onChange={handleChange} />} />
      </FormGroup>
    </div>
  )
}

export default SourceColor
