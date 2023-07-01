import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MAP_TYPE } from '../../../../../constants'
import constantsTestid from '../../../../../constants/testid.js'
import { getMapType, setMapType } from '../../../../../utils/localStorageActions'
import './index.scss'

const MapType = () => {
  const testid = constantsTestid.mapType
  const { t } = useTranslation()
  const mapType = getMapType() || 'DARK'

  const handleChange = e => {
    setMapType(e.target.value)
    location.reload()
  }

  return (
    <div data-testid={testid.container} className="map-type">
      <FormControl fullWidth>
        <InputLabel id="map-type">{t('Type of Map')}</InputLabel>
        <Select
          size="small"
          className="map-type__select"
          labelId="map-type"
          value={mapType}
          label={t('Type of Map')}
          onChange={handleChange}>
          {Object.keys(MAP_TYPE).map((type, key) => (
            <MenuItem key={key} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default MapType
