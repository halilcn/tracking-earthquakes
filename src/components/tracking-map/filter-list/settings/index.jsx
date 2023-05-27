import FullScreen from './full-screen'
import './index.scss'
import MapType from './map-type'
import ChooseLanguage from './choose-language'
import { isMobile } from '../../../../utils/index'
import FaultLine from './fault-line'
import NewEarthquakeSoundNotification from './new-earthquake-sound-notification'

const Settings = () => {
  return (
    <div className="settings">
      <div className="settings__item">
        <MapType />
      </div>
      <div className="settings__item">
        <ChooseLanguage />
      </div>
      <div className="settings__item">
        <FaultLine />
      </div>
      <div className="settings__item">
        <NewEarthquakeSoundNotification />
      </div>
      {!isMobile() && (
        <div className="settings__item">
          <FullScreen />
        </div>
      )}
    </div>
  )
}

export default Settings
