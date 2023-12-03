import { useState } from 'react'

import Popup from '../../popup'
import ChattingAIMessageInput from './chatting-ai-message-input'
import ChattingAIMessages from './chatting-ai-messages'
import ChattingAITopHeader from './chatting-ai-top-header'
import './index.scss'

const ChattingAIModal = props => {
  const { enabled, disableHandle } = props

  const [isAnswering, setIsAnswering] = useState(false)

  return (
    <Popup enabled={enabled} disableHandle={disableHandle} customTopHeader={<ChattingAITopHeader />} customPopupModalClass="chatting-popup">
      <div className="chatting-popup__content">
        <ChattingAIMessages isAnswering={isAnswering} />
        <ChattingAIMessageInput isAnswering={isAnswering} setIsAnswering={setIsAnswering} />
      </div>
    </Popup>
  )
}

export default ChattingAIModal
