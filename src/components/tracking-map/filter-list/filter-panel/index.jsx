import TimeFilter from './time-filter'
import MagnitudeFilter from './magnitude-filter'
import { isMobile } from '../../../../utils/index'
import { AiOutlineFilter } from 'react-icons/ai'
import Button from '@mui/material/Button'

import './index.scss'
import { useState } from 'react'
import { display } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions, isSelectedAnyArchiveItem, isSelectedAnyFilterPanelItem } from '../../../../store/earthquake'

const FilterPanel = () => {
  const dispatch = useDispatch()

  const [filterPanelEnabled, setFilterPanelEnabled] = useState(false)

  const selectedArchive = useSelector(isSelectedAnyArchiveItem)
  const selectedFilterPanelItem = useSelector(isSelectedAnyFilterPanelItem)

  const toggleFilterPanelEnabled = () => setFilterPanelEnabled(status => !status)

  const clearFilter = () => dispatch(earthquakeActions.clearFilterPanelItems())

  return (
    <>
      <div className="filter-panel">
        {!selectedArchive && (
          <div className="filter-panel__item">
            <TimeFilter />
          </div>
        )}
        <div className="filter-panel__item">
          <MagnitudeFilter />
        </div>
        {selectedFilterPanelItem && (
          <Button onClick={clearFilter} className="filter-panel__clear-button" variant="contained" color="error">
            TEMİZLE
          </Button>
        )}
      </div>
    </>
  )
}

export default FilterPanel
