import cx from 'classnames'
import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiFilterAlt } from 'react-icons/bi'
import { BsCalendarDate } from 'react-icons/bs'
import { FiPlay, FiSettings } from 'react-icons/fi'
import { useSelector } from 'react-redux'

import { isSelectedAnyArchiveItem, isSelectedAnyFilterPanelItem } from '../../../store/earthquake'
import { isMobile } from '../../../utils'
import Animation from './animation'
import FilterArchive from './filter-archive'
import FilterPanel from './filter-panel'
import './index.scss'
import LoadingData from './loading-data'
import Settings from './settings'

const FilterList = () => {
  const FILTER_CONTENT_TYPE = {
    ANIMATION: 'animation',
    ARCHIVE: 'archive',
    FILTER_PANEL: 'filterPanel',
    SETTINGS: 'settings',
  }

  const { t } = useTranslation()

  const [filterContentType, setFilterContentType] = useState(null)
  const [filterContentEnable, setFilterContentEnable] = useState(false)

  const selectedArchiveFilterItem = useSelector(isSelectedAnyArchiveItem)
  const selectedFilterPanelItem = useSelector(isSelectedAnyFilterPanelItem)
  const isAnimationActive = useSelector(state => state.earthquake.animation.currentDate)

  const MemoizedFilterContent = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ANIMATION) return <Animation />
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return <FilterArchive />
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return <FilterPanel />
    if (filterContentType === FILTER_CONTENT_TYPE.SETTINGS) return <Settings />
  }, [filterContentType])

  const MemoizedFilterText = useCallback(() => {
    if (filterContentType === FILTER_CONTENT_TYPE.ANIMATION) return t('ANIMATION')
    if (filterContentType === FILTER_CONTENT_TYPE.ARCHIVE) return t('PAST EARTHQUAKES')
    if (filterContentType === FILTER_CONTENT_TYPE.FILTER_PANEL) return t('FILTERS')
    if (filterContentType === FILTER_CONTENT_TYPE.SETTINGS) return t('SETTINGS')
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
      open: { opacity: 1, top: isMobile() ? 50 : 70, display: 'block' },
      closed: { opacity: 0, top: 110, transitionEnd: { display: 'none' } },
    },
  }

  const FILTER_LIST = [
    {
      type: FILTER_CONTENT_TYPE.ANIMATION,
      icon: <FiPlay className="filter__icon" />,
      itemCustomClasses: isAnimationActive && 'filter__item--active',
    },
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
        {FILTER_LIST.map(filter => (
          <div
            onClick={() => handleSetFilterContentType(filter.type)}
            className={cx('filter__item', 'filter__item--icon', filter.itemCustomClasses || '', {
              'filter__item--selected': isSelectedType(filter.type),
            })}>
            {filter.icon}
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
