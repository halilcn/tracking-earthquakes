import CircularProgress from '@mui/material/CircularProgress'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { postLogout } from '../../../api'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { authActions } from '../../../store/auth'
import { removeUserToken } from '../../../utils/localStorageActions'
import './index.scss'

const UserTop = () => {
  const [isEnabledUserDropdown, setIsEnabledUserDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const userTopRef = useRef()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)

  // TODO: we should not trigger on every click
  useOnClickOutside(userTopRef, () => {
    setIsEnabledUserDropdown(false)
  })

  const handleOnClickUserInfo = () => {
    setIsEnabledUserDropdown(!isEnabledUserDropdown)
  }

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)

      await postLogout()

      dispatch(authActions.removeUserToken())
      removeUserToken()
    } catch (err) {
      alert(t('Occurred a problem'))
    } finally {
      setIsLoggingOut(false)
    }
  }

  const userDropdownProps = {
    className: 'user-top__dropdown',
    animate: isEnabledUserDropdown ? 'open' : 'closed',
    initial: false,
    variants: {
      open: { opacity: 1, visibility: 'visible' },
      closed: { opacity: 0, visibility: 'hidden' },
    },
  }

  return (
    <div ref={userTopRef} className="user-top">
      <div onClick={handleOnClickUserInfo} className="user-top__info">
        <div className="user-top__user-name">{user.name}</div>
        <img className="user-top__user-image" src={user.photo} referrerpolicy="no-referrer" />
      </div>
      <motion.div {...userDropdownProps}>
        <div onClick={handleSignOut} className={`user-top__item user-top__item--sign-out ${isLoggingOut && 'user-top__item--disabled'}`}>
          {t('Sign out')}
          {isLoggingOut && <CircularProgress className="user-top__sign-out-loading" color="inherit" size={13} />}
        </div>
      </motion.div>
    </div>
  )
}

export default UserTop
