import { IoMdClose } from 'react-icons/io'
import { motion } from 'framer-motion'

import './index.scss'

const Popup = props => {
  const { children, title, enabled, disableHandle } = props

  const popupBgFilterProps = {
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
    className: 'popup__modal',
    initial: enabled ? 'open' : 'closed',
    animate: enabled ? 'open' : 'closed',
    variants: {
      open: {
        display: 'block',
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
    <div className="popup">
      <motion.div {...popupBgFilterProps} />
      <motion.div {...popupModalProps}>
        <div className="popup__top">
          <div className="popup__title">{title}</div>
          <IoMdClose className="popup__close-button" onClick={disableHandle} />
        </div>
        <div className="popup__content">{children}</div>
      </motion.div>
    </div>
  )
}

export default Popup
