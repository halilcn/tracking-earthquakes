import TimeFilter from '../time-filter'
import AddCustomPoint from './add-custom-point'
import MapType from './map-type'
import MagnitudeFilter from '../magnitude-filter'

import './index.scss'

const FilterPanel = () => {
  return (
    <div className="filter-panel">
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
  )
}

export default FilterPanel
