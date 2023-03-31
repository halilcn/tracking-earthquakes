import { BsCalendarDate } from 'react-icons/bs'
import { BiFilterAlt } from 'react-icons/bi'
import FilterArchive from './filter-archive'
import FilterPanel from './filter-panel'
import LoadingData from './loading-data'
import { useCallback, useMemo, useState } from 'react'

import './index.scss'

const FilterList = () => {
  const [filterContentType, setFilterContentType] = useState(null)

  const FILTER_CONTENT_TYPE = {
    ARCHIVE: 'archive',
    FILTER_PANEL: 'filterPanel',
  }

  const MemoizedFilterContent = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return <FilterArchive />
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return <FilterPanel />
  }, [filterContentType])

  const MemoizedFilterText = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return 'Geçmiş Depremler'
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return 'Filtreler'
  }, [filterContentType])

  const isSelectedType = type => type === filterContentType

  const handleSetFilterContentType = type => {
    if (isSelectedType(type)) {
      setFilterContentType(null)
      return
    }
    setFilterContentType(type)
  }

  return (
    <div className="filter">
      <div className="filter__list">
        <div className="filter__item">
          <LoadingData />
        </div>
        <div
          onClick={() => handleSetFilterContentType(FILTER_CONTENT_TYPE.ARCHIVE)}
          className={`filter__item filter__item--icon ${isSelectedType(FILTER_CONTENT_TYPE.ARCHIVE) && 'filter__item--selected'}`}>
          <BsCalendarDate className="filter__icon" />
          <div className="filter__icon-blur" />
        </div>
        <div
          onClick={() => handleSetFilterContentType(FILTER_CONTENT_TYPE.FILTER_PANEL)}
          className={`filter__item filter__item--icon ${isSelectedType(FILTER_CONTENT_TYPE.FILTER_PANEL) && 'filter__item--selected'}`}>
          <BiFilterAlt className="filter__icon" />
          <div className="filter__icon-blur" />
        </div>
      </div>
      {filterContentType && (
        <div className="filter__content">
          <div className="filter__title">
            <MemoizedFilterText />
          </div>
          <div className="filter__content-container">
            <MemoizedFilterContent />
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterList
