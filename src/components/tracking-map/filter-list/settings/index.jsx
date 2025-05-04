import React from 'react'

import constantsTestid from '../../../../constants/testid'
import { isMobile } from '../../../../utils/index'
import ChooseLanguage from './choose-language'
import FullScreen from './full-screen'
import './index.scss'
import MapType from './map-type'
import NewEarthquakeSoundNotification from './new-earthquake-sound-notification'

const Settings = () => {
  const testid = constantsTestid.settings

  return (
    <div data-testid={testid.container} className="settings">
      <div className="settings__item">
        <MapType />
      </div>
      <div className="settings__item">
        <ChooseLanguage />
      </div>
      <div className="settings__item">
        <NewEarthquakeSoundNotification />
      </div>
      {!isMobile() && (
        <div data-testid={testid.fullScreenButton} className="settings__item">
          <FullScreen />
        </div>
      )}
    </div>
  )
}

export default Settings
