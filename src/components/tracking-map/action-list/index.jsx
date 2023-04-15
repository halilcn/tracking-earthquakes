import EarthquakeList from '../../earthquake-list'
import { motion } from 'framer-motion'
import { BsListUl, BsSearch } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import './index.scss'
import { useState } from 'react'

const ActionList = () => {
  const [actionListEnable, setActionListEnable] = useState(false)
  // const [earthquakeListEnable, setEarthquakeListEnable] = useState(getEarthquakeListStatus() === 'true')

  const handleActionListEnable = type => {
    setActionListEnable(type)
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
    className: 'action-list__content',
    //initial: earthquakeListEnable ? 'open' : 'closed',
    animate: actionListEnable ? 'open' : 'closed',
    variants: {
      open: { opacity: 1, left: 0 },
      closed: { opacity: 0, left: -550 },
    },
    transition: { ease: 'easeOut', duration: 0.3 },
  }

  console.log('actionListEnable', actionListEnable)

  return (
    <div className="action-list">
      <motion.div {...actionListProps}>
        <div onClick={() => handleActionListEnable(true)} className="action-list__item action-list__item--search">
          <BsSearch className="action-list__item-icon" />
          <div className="action-list__item-bg-filter" />
        </div>
        <div onClick={() => handleActionListEnable(true)} className="action-list__item action-list__item--earthquake-list">
          <BsListUl className="action-list__item-icon" />
          <div className="action-list__item-bg-filter" />
        </div>
      </motion.div>
      <motion.div {...earthquakeListProps}>
        <div className="action-list__close-button">
          <IoMdClose onClick={() => handleActionListEnable(false)} className="action-list__close-button-icon" />
        </div>
        <EarthquakeList handleActionListDisable={() => handleActionListEnable(false)} />
      </motion.div>
    </div>
  )
}

export default ActionList
