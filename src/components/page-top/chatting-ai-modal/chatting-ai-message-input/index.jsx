import { useState } from 'react'

import './index.scss'

const ChattingAIMessageInput = () => {
  const [isFocused, setIsFocused] = useState(false)

  const inputHandleOnFocus = () => {
    setIsFocused(true)
  }

  const inputHandleOnBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className="chatting-message-input">
      <div className={`chatting-message-input__input-container ${isFocused ? 'chatting-message-input__input-container--focused' : ''}`}>
        <input
          onFocus={inputHandleOnFocus}
          onBlur={inputHandleOnBlur}
          placeholder="Type your question"
          className="chatting-message-input__type-text"
          type="text"
        />
        <div className="chatting-message-input__send-button chatting-message-input__send-button--disabled">Send</div>
      </div>
    </div>
  )
}

export default ChattingAIMessageInput
