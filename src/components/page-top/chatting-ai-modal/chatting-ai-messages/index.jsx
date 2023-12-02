import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import MessageGeneralType from '../../../../../public/message-types/ai.png'
import MessageEarthquakeType from '../../../../../public/message-types/earthquake.png'
import { getAllMessages } from '../../../../api'
import { MESSAGE_OWNER_TYPES, MESSAGE_TYPES } from '../../../../constants'
import { messageActions } from '../../../../store/message'
import Skelton from '../../../skeleton'
import './index.scss'

const checkIsUserOwnerMessage = type => type === MESSAGE_OWNER_TYPES.USER
const checkIsGeneralMessage = type => type === MESSAGE_TYPES.GENERAL

const ChattingAIMessages = () => {
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const allMessages = useSelector(store => store.message.allMessages)
  const hasMessage = allMessages.length > 0

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
        allMessages.map(message => (
          <div
            className={`chatting-messages__item ${
              checkIsUserOwnerMessage(message.owner) ? 'chatting-messages__item--me' : 'chatting-messages__item--ai'
            }`}>
            <div className="chatting-messages__content">{message.content}</div>
            {checkIsUserOwnerMessage(message.owner) && (
              <div className="chatting-messages__info">
                <div className="chatting-messages__info-item">
                  <div className="chatting-messages__info-title">{t('Type')}:</div>
                  <div className="chatting-messages__info-content">
                    <img
                      src={checkIsGeneralMessage(message.type) ? MessageGeneralType : MessageEarthquakeType}
                      className="chatting-messages__message-type-img"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

export default ChattingAIMessages
