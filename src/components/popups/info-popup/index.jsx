import Popup from '../../popup'

import './index.scss'

const InfoPopup = props => {
  const { enabled, disableHandle } = props

  return (
    <Popup title="Info" enabled={enabled} disableHandle={disableHandle}>
      popup içeriği!
    </Popup>
  )
}

export default InfoPopup
