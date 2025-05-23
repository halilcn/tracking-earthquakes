import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import MessageGeneralType from '../../../../../public/message-types/ai.png'
import MessageEarthquakeType from '../../../../../public/message-types/earthquake.png'
import { getAllMessages } from '../../../../api'
import { MESSAGE_OWNER_TYPES, MESSAGE_TYPES } from '../../../../constants'
import { messageActions } from '../../../../store/message'
import Skelton from '../../../skeleton'
import ChattingAiLoadingMessageContent from './chatting-ai-loading-message-content'
import './index.scss'

const ChattingAIMessages = props => {
  const { isAnswering } = props

  const [isLoading, setIsLoading] = useState(true)
  const [selectedAiOwnerTypeMessageId, setSelectedAiOwnerTypeMessageId] = useState(null)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lastMessageInspectorRef = useRef(null)

  const allMessages = useSelector(store => store.message.allMessages)
  const hasMessage = allMessages.length > 0

  const scrollToLastMessage = () =>
    setTimeout(() => {
      lastMessageInspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 10)

  const checkIsSelectedAiOwnerTypeMessage = messageId => messageId === selectedAiOwnerTypeMessageId
  const handleClickAiOwnerMessage = messageId => () =>
    setSelectedAiOwnerTypeMessageId(checkIsSelectedAiOwnerTypeMessage(messageId) ? null : messageId)

  const handleGetMessages = async () => {
    try {
      const res = await getAllMessages()
      dispatch(messageActions.setAllMessages(res.data.messages))
    } catch (err) {
      alert(t('Occurred a problem'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetMessages()
  }, [])

  useEffect(() => {
    if (isAnswering) {
      scrollToLastMessage()
    }
  }, [isAnswering])

  useEffect(() => {
    if (hasMessage) {
      scrollToLastMessage()
    }
  }, [allMessages])

  return (
    <div className="chatting-messages">
      {isLoading && (
        <div className="chatting-messages__skelton-list">
          {new Array(6).fill(0).map((_, index) => (
            <Skelton className={`chatting-messages__skelton ${index % 2 === 0 ? 'chatting-messages__skelton--user' : ''}`} />
          ))}
        </div>
      )}
      {!isLoading && !hasMessage && (
        <div className="chatting-messages__hello-message">{t('No messages yet. You can ask anything related to earthquakes!')}</div>
      )}
      {!isLoading &&
        hasMessage &&
        allMessages.map((message, key) => (
          <div
            {...(message.owner === MESSAGE_OWNER_TYPES.AI ? { onClick: handleClickAiOwnerMessage(message._id) } : {})}
            key={message._id || key}
            className={`chatting-messages__item ${
              message.owner === MESSAGE_OWNER_TYPES.USER ? 'chatting-messages__item--me' : 'chatting-messages__item--ai'
            }`}>
            <div className="chatting-messages__content">{message.content}</div>
            {checkIsSelectedAiOwnerTypeMessage(message._id) && message.owner === MESSAGE_OWNER_TYPES.AI && (
              <div className="chatting-messages__info">
                <div className="chatting-messages__info-item">
                  <div className="chatting-messages__info-title">{t('Type')}:</div>
                  <div className="chatting-messages__info-content">
                    <img
                      src={message.type === MESSAGE_TYPES.GENERAL ? MessageGeneralType : MessageEarthquakeType}
                      className="chatting-messages__message-type-img"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      {isAnswering && (
        <div className="chatting-messages__item chatting-messages__item--ai chatting-messages__item--loading-message">
          <div className="chatting-messages__content">
            <ChattingAiLoadingMessageContent />
          </div>
        </div>
      )}
      <div ref={lastMessageInspectorRef} />
    </div>
  )
}

export default ChattingAIMessages
