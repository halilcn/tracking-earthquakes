import { useState } from 'react'
import { BiHelpCircle } from 'react-icons/bi'

import githubImage from '../../assets/github.png'
import InfoPopup from '../popups/info-popup'
import './index.scss'

const PageTop = () => {
  const POPUP_CONTENT_TYPES = {
    INFO: 'info',
  }

  const [activePopupContentType, setActivePopupContentType] = useState(null)

  const disablePopup = () => setActivePopupContentType(null)
  const isActivePopup = type => activePopupContentType === type

  return (
    <div className="app-top">
      <div className="app-top__github-link">
        <a href="https://github.com/halilcn/tracking-earthquakes" target="_blank">
          <img className="app-top__github-icon" src={githubImage} />
          <div className="app-top__github-text">Github</div>
        </a>
      </div>
      <div className="app-top__action-list">
        <BiHelpCircle onClick={() => setActivePopupContentType(POPUP_CONTENT_TYPES.INFO)} className="app-top__action-item" />
      </div>
      <InfoPopup enabled={isActivePopup(POPUP_CONTENT_TYPES.INFO)} disableHandle={disablePopup} />
    </div>
  )
}

export default PageTop
