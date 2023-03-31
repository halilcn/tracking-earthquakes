import { BsCalendarDate } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { BiFilterAlt } from 'react-icons/bi'
import FilterArchive from './filter-archive'
import FilterPanel from './filter-panel'
import LoadingData from './loading-data'
import { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'

import './index.scss'
import { useSelector } from 'react-redux'
import { isSelectedAnyArchiveItem, isSelectedAnyFilterPanelItem } from '../../../store/earthquake'

const FilterList = () => {
  const [filterContentType, setFilterContentType] = useState(null)

  const selectedArchiveFilterItem = useSelector(isSelectedAnyArchiveItem)
  const selectedFilterPanelItem = useSelector(isSelectedAnyFilterPanelItem)

  const FILTER_CONTENT_TYPE = {
    ARCHIVE: 'archive',
    FILTER_PANEL: 'filterPanel',
  }

  const MemoizedFilterContent = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return <FilterArchive />
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return <FilterPanel />
  }, [filterContentType])

  const MemoizedFilterText = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return 'GEÇMİŞ DEPREMLER'
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return 'FİLTRELER'
  }, [filterContentType])

  const isSelectedType = type => type === filterContentType

  const handleSetFilterContentType = type => {
    if (isSelectedType(type)) {
      setFilterContentType(null)
      return
    }
    setFilterContentType(type)
  }

  const testProp = {
    className: 'filter__content',
    animate: filterContentType ? 'open' : 'closed',
    variants: {
      open: { opacity: 1, top: 70 },
      closed: { opacity: 0, top: 100 },
    },
  }

  return (
    <div className="filter">
      <div className="filter__list">
        <div className="filter__item">
          <LoadingData />
        </div>
        <div
          onClick={() => handleSetFilterContentType(FILTER_CONTENT_TYPE.ARCHIVE)}
          className={cx('filter__item', 'filter__item--icon', {
            'filter__item--selected': isSelectedType(FILTER_CONTENT_TYPE.ARCHIVE),
            'filter__item--active': selectedArchiveFilterItem,
          })}>
          <BsCalendarDate className="filter__icon" />
          <div className="filter__icon-blur" />
        </div>
        <div
          onClick={() => handleSetFilterContentType(FILTER_CONTENT_TYPE.FILTER_PANEL)}
          className={cx('filter__item', 'filter__item--icon', {
            'filter__item--selected': isSelectedType(FILTER_CONTENT_TYPE.FILTER_PANEL),
            'filter__item--active': selectedFilterPanelItem,
          })}>
          <BiFilterAlt className="filter__icon" />
          <div className="filter__icon-blur" />
        </div>
      </div>
      <motion.div {...testProp}>
        <div className="filter__title">
          <MemoizedFilterText />
        </div>
        <div className="filter__content-container">
          <MemoizedFilterContent />
        </div>
      </motion.div>
    </div>
  )
}

export default FilterList
