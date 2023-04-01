import FullScreen from './full-screen'
import './index.scss'
import MapType from './map-type'
import { isMobile } from '../../../../utils/index'

const Settings = () => {
  return (
    <div className="settings">
      <div className="settings__item">
        <MapType />
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
