import TimeFilter from './time-filter'
import MagnitudeFilter from './magnitude-filter'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { earthquakeActions, isSelectedAnyArchiveItem, isSelectedAnyFilterPanelItem } from '../../../../store/earthquake'
import { useTranslation } from 'react-i18next'
import DepthFilter from './depth-filter'

import './index.scss'

const FilterPanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const selectedArchive = useSelector(isSelectedAnyArchiveItem)
  const selectedFilterPanelItem = useSelector(isSelectedAnyFilterPanelItem)

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
        <div className="filter-panel__item">
          <DepthFilter />
        </div>
        {selectedFilterPanelItem && (
          <Button onClick={clearFilter} className="filter-panel__clear-button" variant="contained" color="error">
            {t('REMOVE')}
          </Button>
        )}
      </div>
    </>
  )
}

export default FilterPanel
