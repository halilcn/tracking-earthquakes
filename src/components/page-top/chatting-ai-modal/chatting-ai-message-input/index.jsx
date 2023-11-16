import './index.scss'

const ChattingAIMessageInput = () => {
  return (
    <div className="chatting-message-input">
      <div className="chatting-message-input__input-container">
        <input placeholder='Type your question' className='chatting-message-input__type-text' type="text" />
        <div className="chatting-message-input__send-button">Send</div>
      </div>
    </div>
  )
}

export default ChattingAIMessageInput
