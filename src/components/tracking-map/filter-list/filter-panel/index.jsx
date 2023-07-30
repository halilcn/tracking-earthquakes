import Button from '@mui/material/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import constantsTestid from '../../../../constants/testid'
import {
  defaultEarthquakeFilterState,
  earthquakeActions,
  isSelectedAnyArchiveItem,
  isSelectedAnyFilterPanelItem,
} from '../../../../store/earthquake'
import { changeURL } from '../../../../utils'
import { deleteEarthquakeFiltersQueryParam } from '../../../../utils/queryParamsActions'
import DepthFilter from './depth-filter'
import './index.scss'
import MagnitudeFilter from './magnitude-filter'
import SourceFilter from './source-filter'
import TimeFilter from './time-filter'

const FilterPanel = () => {
  const testid = constantsTestid.filterPanel
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const selectedArchive = useSelector(isSelectedAnyArchiveItem)
  const selectedFilterPanelItem = useSelector(isSelectedAnyFilterPanelItem)
  const isAnimationActive = useSelector(state => state.earthquake.animation.currentDate)

  const isActiveTimeFilter = !selectedArchive && !isAnimationActive

  const handleDeleteEarthquakeFilterParam = () => {
    const url = deleteEarthquakeFiltersQueryParam()
    changeURL(url)
  }

  const clearFilter = () => {
    dispatch(earthquakeActions.setEarthquakeFilter(defaultEarthquakeFilterState))
    handleDeleteEarthquakeFilterParam()
  }

  return (
    <>
      <div data-testid={testid.filterContainer} className="filter-panel">
        {isActiveTimeFilter && (
          <div data-testid={testid.timeFilterContainer} className="filter-panel__item">
            <TimeFilter />
          </div>
        )}
        <div className="filter-panel__item">
          <MagnitudeFilter />
        </div>
        <div className="filter-panel__item">
          <DepthFilter />
        </div>
        <div className="filter-panel__item">
          <SourceFilter />
        </div>
        {selectedFilterPanelItem && (
          <Button
            data-testid={testid.removeButton}
            onClick={clearFilter}
            className="filter-panel__clear-button"
            variant="contained"
            color="error">
            {t('REMOVE')}
          </Button>
        )}
      </div>
    </>
  )
}

export default FilterPanel
