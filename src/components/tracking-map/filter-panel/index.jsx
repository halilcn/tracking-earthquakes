import TimeFilter from './time-filter'
import AddCustomPoint from './add-custom-point'
import MapType from './map-type'
import MagnitudeFilter from './magnitude-filter'
import { isMobile } from '../../../utils/index'
import { AiOutlineFilter } from 'react-icons/ai'

import './index.scss'
import { useState } from 'react'
import { display } from '@mui/system'

const FilterPanel = () => {
  const [filterPanelEnabled, setFilterPanelEnabled] = useState(false)

  const toggleFilterPanelEnabled = () => setFilterPanelEnabled(status => !status)

  return (
    <>
      <div className="filter-panel__mobile-button">
        <AiOutlineFilter onClick={toggleFilterPanelEnabled} />
      </div>
      <div className="filter-panel" {...(isMobile() && { style: { display: filterPanelEnabled ? 'block' : 'none' } })}>
        <div className="filter-panel__item">
          <TimeFilter />
        </div>
        <div className="filter-panel__item">
          <MagnitudeFilter />
        </div>
        <div className="filter-panel__item">
          <MapType />
        </div>
        <div className="filter-panel__item">
          <AddCustomPoint />
        </div>
      </div>
    </>
  )
}

export default FilterPanel
