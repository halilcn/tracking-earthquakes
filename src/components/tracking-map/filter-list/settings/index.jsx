import FullScreen from './full-screen'
import './index.scss'
import MapType from './map-type'
import ChooseLanguage from './choose-language'
import { isMobile } from '../../../../utils/index'

const Settings = () => {
  return (
    <div className="settings">
      <div className="settings__item">
        <MapType />
      </div>
      <div className="settings__item">
        <ChooseLanguage />
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
