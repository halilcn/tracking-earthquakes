import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { MAP_TYPE } from '../../../../constants'
import { getMapType, setMapType } from '../../../../utils/localStorageActions'

import './index.scss'

const MapType = () => {
  const mapType = getMapType() || 'DARK'

  const handleChange = e => {
    setMapType(e.target.value)
    location.reload()
  }

  return (
    <div className="map-type">
      <FormControl style={{ width: 130 }}>
        <InputLabel id="map-type">Harita Tipi</InputLabel>
        <Select labelId="map-type" value={mapType} label="Harita Tipi" onChange={handleChange}>
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
