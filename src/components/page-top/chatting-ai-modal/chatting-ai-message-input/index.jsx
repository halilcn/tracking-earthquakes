import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postAIMessage } from '../../../../api'
import { MESSAGE_OWNER_TYPES } from '../../../../constants'
import { messageActions } from '../../../../store/message'
import './index.scss'

// TODO: message limit
// TODO: general error handler
// TODO: limit usage error handler
const ChattingAIMessageInput = props => {
  const { isAnswering, setIsAnswering } = props

  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const isDisabled = message === ''

  const handleOnFocusMessageInput = () => {
    setIsFocused(true)
  }

  const handleOnBlurMessageInput = () => {
    setIsFocused(false)
  }

  const handleChangeMessageInput = e => {
    setMessage(e.target.value)
  }

  const handleTriggerFunctions = async functionCall => {
    // TODO:
    console.log('func trigger', functionCall)
  }

  const handleMessageActionsByResponse = async res => {
    const functionCall = res.data?.functionCall
    if (functionCall) {
      await handleTriggerFunctions(functionCall)
      return
    }

    const message = res.data?.message
    if (message) {
      dispatch(messageActions.addMessage(message))
    }
  }

  const handleAddUserOwnerMessage = () => {
    const userOwnerMessage = {
      content: message,
      owner: MESSAGE_OWNER_TYPES.USER,
    }
    dispatch(messageActions.addMessage(userOwnerMessage))
  }

  const handlePostAIMessage = async () => {
    try {
      handleAddUserOwnerMessage()
      setMessage('')
      setIsAnswering(true)

      const res = await postAIMessage({
        content: message,
      })
      await handleMessageActionsByResponse(res)
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <div className="chatting-message-input">
      <div className={`chatting-message-input__input-container ${isFocused ? 'chatting-message-input__input-container--focused' : ''}`}>
        <input
          onFocus={handleOnFocusMessageInput}
          onBlur={handleOnBlurMessageInput}
          onChange={handleChangeMessageInput}
          value={message}
          placeholder={t('Type a question')}
          className="chatting-message-input__type-text"
          type="text"
        />
        <div
          onClick={handlePostAIMessage}
          className={`chatting-message-input__send-button ${
            (isDisabled || isAnswering) && 'chatting-message-input__send-button--disabled'
          }`}>
          {t('Send')}
        </div>
      </div>
    </div>
  )
}

export default ChattingAIMessageInput
