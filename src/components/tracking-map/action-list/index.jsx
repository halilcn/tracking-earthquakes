import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import React from 'react'
import { BsListUl, BsSearch } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'

import constantsTestid from '../../../constants/testid'
import { getLeftPanelStatus, getLeftPanelType, setLeftPanelStatus, setLeftPanelType } from '../../../utils/localStorageActions'
import EarthquakeList from '../../earthquake-list'
import Search from '../../search'
import './index.scss'

export const CONTENT_TYPES = {
  EARTHQUAKE_LIST: 'EARTHQUAKE_LIST',
  SEARCH: 'SEARCH',
}

const ActionList = () => {
  const testid = constantsTestid.actionList
  const [actionListEnable, setActionListEnable] = useState(getLeftPanelStatus() === 'true')
  const [activeContentType, setActiveContentType] = useState(getLeftPanelType())

  const handleActiveList = type => {
    setActiveContentType(type)
    setActionListEnable(true)
    setLeftPanelStatus(true)
    setLeftPanelType(type)
  }

  const handleDisableList = () => {
    setActionListEnable(false)
    setLeftPanelStatus(false)
  }

  const actionListProps = {
    className: 'action-list__list',
    animate: actionListEnable ? 'closed' : 'open',
    variants: {
      open: { opacity: 1, left: 25 },
      closed: { opacity: 0, left: -50 },
    },
    transition: { type: 'spring', stiffness: 80 },
  }

  const earthquakeListProps = {
    'data-testid': testid.content,
    className: 'action-list__content',
    initial: actionListEnable ? 'open' : 'closed',
    animate: actionListEnable ? 'open' : 'closed',
    variants: {
      open: { opacity: 1, left: 0 },
      closed: { opacity: 0, left: -450 },
    },
    transition: { ease: 'easeOut', duration: 0.3 },
  }

  const memoizedContent = useMemo(() => {
    switch (activeContentType) {
      case CONTENT_TYPES.EARTHQUAKE_LIST:
        return <EarthquakeList handleActionListDisable={() => handleDisableList()} />
      case CONTENT_TYPES.SEARCH:
        return <Search />
    }
  }, [activeContentType])

  return (
    <div data-testid={testid.listContainer} className="action-list">
      <motion.div {...actionListProps}>
        <div
          data-testid={testid.searchItem}
          onClick={() => handleActiveList(CONTENT_TYPES.SEARCH)}
          className="action-list__item action-list__item--search">
          <BsSearch className="action-list__item-icon" />
          <div className="action-list__item-bg-filter" />
        </div>
        <div
          data-testid={testid.earthquakeListItem}
          onClick={() => handleActiveList(CONTENT_TYPES.EARTHQUAKE_LIST)}
          className="action-list__item action-list__item--earthquake-list">
          <BsListUl className="action-list__item-icon" />
          <div className="action-list__item-bg-filter" />
        </div>
      </motion.div>
      <motion.div {...earthquakeListProps}>
        <div className="action-list__close-button">
          <IoMdClose data-testid={testid.disableContent} onClick={() => handleDisableList()} className="action-list__close-button-icon" />
        </div>
        {memoizedContent}
      </motion.div>
    </div>
  )
}

export default ActionList
