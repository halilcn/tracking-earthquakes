import { useState } from 'react'

import AIImage from '../../../../public/ai.png'
import Popup from '../../popup'
import ChattingAIMessageInput from './chatting-ai-message-input'
import ChattingAIMessages from './chatting-ai-messages'
import './index.scss'

const CustomTopHeader = () => {
  return (
    <div className="chatting-top-header">
      <div className="chatting-top-header__title">
        <img className="chatting-top-header__ai-image" alt="ai image" src={AIImage} />
        <div className="chatting-top-header__text">CHAT</div>
      </div>
    </div>
  )
}

const ChattingAIModal = props => {
  const { enabled, disableHandle } = props

  const [isAnswering, setIsAnswering] = useState(false)

  return (
    <Popup enabled={enabled} disableHandle={disableHandle} customTopHeader={<CustomTopHeader />} customPopupModalClass="chatting-popup">
      <div className="chatting-popup__content">
        <ChattingAIMessages isAnswering={isAnswering} />
        <ChattingAIMessageInput isAnswering={isAnswering} setIsAnswering={setIsAnswering} />
      </div>
    </Popup>
  )
}

export default ChattingAIModal
