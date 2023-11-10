import { Button } from '@mui/material'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import React from 'react'
import { AiOutlineGithub } from 'react-icons/ai'
import { BiHelpCircle } from 'react-icons/bi'

import { getCurrentLanguage } from '../../utils'
import InfoPopup from '../popups/info-popup'
import './index.scss'

// TODO:

const PageTop = () => {
  const POPUP_CONTENT_TYPES = {
    INFO: 'info',
  }

  const [activePopupContentType, setActivePopupContentType] = useState(null)

  const disablePopup = () => setActivePopupContentType(null)
  const isActivePopup = type => activePopupContentType === type

  const googleAuthProviderProps = {
    clientId: process.env.VITE_GOOGLE_CLIENT_ID,
  }

  const googleLoginProps = {
    onSuccess: credentialResponse => {
      console.log('credentialResponse', credentialResponse)
    },
    onError: () => {
      console.log('Login Failed')
    },
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
        <GoogleOAuthProvider {...googleAuthProviderProps}>
          <GoogleLogin {...googleLoginProps} />
        </GoogleOAuthProvider>
      </div>
      <InfoPopup enabled={isActivePopup(POPUP_CONTENT_TYPES.INFO)} disableHandle={disablePopup} />
    </div>
  )
}

export default PageTop
