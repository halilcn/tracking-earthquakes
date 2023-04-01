import { BsCalendarDate } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { BiFilterAlt } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import FilterArchive from './filter-archive'
import FilterPanel from './filter-panel'
import LoadingData from './loading-data'
import Settings from './settings'
import { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'

import './index.scss'
import { useSelector } from 'react-redux'
import { isSelectedAnyArchiveItem, isSelectedAnyFilterPanelItem } from '../../../store/earthquake'
import { isMobile } from '../../../utils'

const FilterList = () => {
  const [filterContentType, setFilterContentType] = useState(null)
  const [filterContentEnable, setFilterContentEnable] = useState(false)

  const selectedArchiveFilterItem = useSelector(isSelectedAnyArchiveItem)
  const selectedFilterPanelItem = useSelector(isSelectedAnyFilterPanelItem)

  const FILTER_CONTENT_TYPE = {
    ARCHIVE: 'archive',
    FILTER_PANEL: 'filterPanel',
    SETTINGS: 'settings',
  }

  const MemoizedFilterContent = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return <FilterArchive />
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return <FilterPanel />
    if (filterContentType === FILTER_CONTENT_TYPE.SETTINGS) return <Settings />
  }, [filterContentType])

  const MemoizedFilterText = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return 'GEÇMİŞ DEPREMLER'
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return 'FİLTRELER'
    if (filterContentType === FILTER_CONTENT_TYPE.SETTINGS) return 'AYARLAR'
  }, [filterContentType])

  const isSelectedType = type => type === filterContentType && filterContentEnable

  const handleSetFilterContentType = type => {
    if (isSelectedType(type)) {
      setFilterContentEnable(false)
      return
    }

    setFilterContentType(type)
    setFilterContentEnable(true)
  }

  const filterContentProp = {
    className: 'filter__content',
    animate: filterContentEnable ? 'open' : 'closed',
    variants: {
      open: { opacity: 1, top: isMobile() ? 50 : 70 },
      closed: {
        opacity: 0,
        top: 110,
      },
    },
  }

  const FILTER_LIST = [
    {
      type: FILTER_CONTENT_TYPE.ARCHIVE,
      icon: <BsCalendarDate className="filter__icon" />,
      itemCustomClasses: selectedArchiveFilterItem && 'filter__item--active',
    },
    {
      type: FILTER_CONTENT_TYPE.FILTER_PANEL,
      icon: <BiFilterAlt className="filter__icon" />,
      itemCustomClasses: selectedFilterPanelItem && 'filter__item--active',
    },
    {
      type: FILTER_CONTENT_TYPE.SETTINGS,
      icon: <FiSettings className="filter__icon" />,
    },
  ]

  return (
    <div className="filter">
      <div className="filter__list">
        <div className="filter__item">
          <LoadingData />
        </div>
        {FILTER_LIST.map(filterItem => (
          <div
            onClick={() => handleSetFilterContentType(filterItem.type)}
            className={cx('filter__item', 'filter__item--icon', filterItem.itemCustomClasses || '', {
              'filter__item--selected': isSelectedType(filterItem.type),
            })}>
            {filterItem.icon}
            <div className="filter__icon-blur" />
          </div>
        ))}
      </div>
      <motion.div {...filterContentProp}>
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
