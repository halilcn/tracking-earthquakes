import { motion } from 'framer-motion'
import React from 'react'
import { IoMdClose } from 'react-icons/io'

import constantsTestid from '../../constants/testid'
import './index.scss'

const Popup = props => {
  const testid = constantsTestid.popup
  const { children, title, enabled, disableHandle, CustomTopHeader, customPopupModalClass } = props

  const hasCustomTopHeader = !!CustomTopHeader

  const popupBgFilterProps = {
    'data-testid': testid.popupBackground,
    className: 'popup__bg-filter',
    initial: enabled ? 'open' : 'closed',
    animate: enabled ? 'open' : 'closed',
    variants: {
      open: {
        display: 'block',
        opacity: 0.3,
      },
      closed: {
        opacity: 0,
        transitionEnd: {
          display: 'none',
        },
      },
    },
    transition: { ease: 'easeOut', duration: 0.2 },
    onClick: disableHandle,
  }

  const popupModalProps = {
    'data-testid': testid.popupContentContainer,
    className: `popup__modal ${customPopupModalClass || ''}`,
    initial: enabled ? 'open' : 'closed',
    animate: enabled ? 'open' : 'closed',
    variants: {
      open: {
        display: 'flex',
        opacity: 1,
      },
      closed: {
        opacity: 0,
        transitionEnd: {
          display: 'none',
        },
      },
    },
    transition: { ease: 'easeOut', duration: 0.2 },
  }

  return (
    <div data-testid={testid.popupContainer} className="popup">
      <motion.div {...popupBgFilterProps} />
      <motion.div {...popupModalProps}>
        <div className={`popup__top ${!hasCustomTopHeader ? 'popup__top--default-header' : ''} `}>
          {hasCustomTopHeader ? <CustomTopHeader /> : <div className="popup__title">{title}</div>}
          <IoMdClose data-testid={testid.closeButton} className="popup__close-button" onClick={disableHandle} />
        </div>
        <div data-testid={testid.content} className="popup__content">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export default Popup
