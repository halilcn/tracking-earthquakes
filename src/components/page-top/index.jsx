import { CircularProgress } from '@mui/material'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineGithub } from 'react-icons/ai'
import { BiHelpCircle } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'

import { postLogin } from '../../api'
import { authActions, isLoggedInSelector } from '../../store/auth'
import { getCurrentLanguage } from '../../utils'
import { setUserToken } from '../../utils/localStorageActions'
import InfoPopup from '../popups/info-popup'
import ChattingAIModal from './chatting-ai-modal'
import './index.scss'
import UserTop from './user-top'

const googleAuthProviderProps = {
  clientId: process.env.VITE_GOOGLE_CLIENT_ID,
}

const POPUP_CONTENT_TYPES = {
  INFO: 'info',
  AI_CHAT: 'ai-chat',
}

const PageTop = () => {
  const [activePopupContentType, setActivePopupContentType] = useState(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const isLoggedIn = useSelector(isLoggedInSelector)

  const disablePopup = () => setActivePopupContentType(null)
  const isActivePopup = type => activePopupContentType === type

  const handleOnSuccess = async credentialResponse => {
    try {
      setIsLoggingIn(true)

      const res = await postLogin(credentialResponse.credential)
      const { user } = res.data
      const { token } = user

      dispatch(authActions.setUser(user))
      dispatch(authActions.setUserToken(token))
      setUserToken(token)
    } catch (err) {
      alert(t('Occurred a problem'))
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleOnError = () => {
    alert(t('Occurred a problem'))
  }

  const handleClickAIChatItem = () => {
    setActivePopupContentType(POPUP_CONTENT_TYPES.AI_CHAT)
  }

  const googleLoginProps = {
    onSuccess: handleOnSuccess,
    onError: handleOnError,
    theme: 'filled_black',
    size: 'medium',
    shape: 'pill',
    locale: getCurrentLanguage(),
  }

  return (
    <div className="app-top">
      <div className="app-top__info-list">
        <a href="https://github.com/halilcn/tracking-earthquakes" target="_blank">
          <AiOutlineGithub className="app-top__action-item app-top__action-item--github" />
        </a>
        <BiHelpCircle
          id="info-popup-button"
          onClick={() => setActivePopupContentType(POPUP_CONTENT_TYPES.INFO)}
          className="app-top__action-item"
        />
      </div>
      <div className="app-top__action-list">
        <div className="app-top__action-links">
          <div className="app-top__link app-top__link--chat">
            <div onClick={handleClickAIChatItem} className={`app-top__link-text ${!isLoggedIn ? 'app-top__link-text--disabled' : ''}`}>
              {t('AI Chat')}
            </div>
            {!isLoggedIn && <div className="app-top__link-tooltip">{t('Login required')}</div>}
          </div>
        </div>
        {isLoggedIn ? (
          <UserTop />
        ) : (
          <GoogleOAuthProvider {...googleAuthProviderProps}>
            <div className={`app-top__login-button ${isLoggingIn && 'app-top__login-button--disabled'}`}>
              {isLoggingIn && <CircularProgress className="app-top__login-loading" color="inherit" size={20} />}
              <GoogleLogin {...googleLoginProps} />
            </div>
          </GoogleOAuthProvider>
        )}
      </div>
      <InfoPopup enabled={isActivePopup(POPUP_CONTENT_TYPES.INFO)} disableHandle={disablePopup} />
      {isLoggedIn && <ChattingAIModal enabled={isActivePopup(POPUP_CONTENT_TYPES.AI_CHAT)} disableHandle={disablePopup} />}
    </div>
  )
}

export default PageTop
