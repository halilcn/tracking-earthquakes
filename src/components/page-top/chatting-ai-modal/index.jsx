import AIImage from '../../../../public/ai.png'
import Popup from '../../popup'
import './index.scss'

const CustomTopHeader = () => {
  return (
    <div className="chatting-top-header">
      <div className="chatting-top-header__title">
        <img className="chatting-top-header__ai-image" src={AIImage} />
        <div className="chatting-top-header__text">CHAT</div>
      </div>
    </div>
  )
}

const ChattingAIModal = props => {
  const { enabled, disableHandle } = props

  return (
    <Popup enabled={enabled} disableHandle={disableHandle} CustomTopHeader={CustomTopHeader} customPopupModalClass="chatting-popup">
      <div className="chatting-content">AI chatting content</div>
    </Popup>
  )
}

export default ChattingAIModal
