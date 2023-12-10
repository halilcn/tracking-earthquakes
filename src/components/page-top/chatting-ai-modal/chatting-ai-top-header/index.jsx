import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdOutlineHelpOutline } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

import AIImage from '../../../../../public/ai.png'
import { getMessageLimits } from '../../../../api'
import useOnClickOutside from '../../../../hooks/useOnClickOutside'
import { messageActions } from '../../../../store/message'
import Skelton from '../../../skeleton'
import './index.scss'

const ChattingAITopHeader = () => {
  const [isMessageLimitsLoading, setIsMessageLimitsLoading] = useState(false)
  const [isEnabledHelpContent, setIsEnabledHelpContent] = useState(false)

  const helpRef = useRef(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const allMessageLimits = useSelector(state => state.message.allMessageLimits)

  useOnClickOutside(helpRef, () => {
    setIsEnabledHelpContent(false)
  })

  const handleClickHelpIcon = () => setIsEnabledHelpContent(prev => !prev)

  const handleGetMessageLimits = async () => {
    try {
      setIsMessageLimitsLoading(true)

      const res = await getMessageLimits()
      dispatch(messageActions.setAllMessageLimits(res.data.messageLimits))
    } finally {
      setIsMessageLimitsLoading(false)
    }
  }

  useEffect(() => {
    handleGetMessageLimits()
  }, [])

  const helpList = [
    {
      content: t('You can ask anything related to earthquakes'),
      desc: `${t('Example')}: ${t('What does depth mean in an earthquake')}?`,
    },
    {
      content: `${t('You can ask anything related to earthquakes that occurred in the past. For now, it is only valid for a day')}.`,
      desc: `${t('Example')}: ${t('What was the biggest occurred earthquake on 8 June 2023')}?`,
    },
    {
      content: `${t("You have tokens to ask questions. You can't ask a question after the tokens run out")}.`,
    },
  ]

  return (
    <div className="chatting-top-header">
      <div className="chatting-top-header__left-section">
        <div ref={helpRef} className="chatting-top-header__help">
          <MdOutlineHelpOutline className="chatting-top-header__help-icon" onClick={handleClickHelpIcon} />
          <div className={`chatting-top-header__help-content ${isEnabledHelpContent ? 'chatting-top-header__help-content--enabled' : ''}`}>
            {helpList.map((item, key) => (
              <div key={key} className="chatting-top-header__help-content-item">
                <div className="chatting-top-header__help-content-item-content">&#9679;{item.content}</div>
                {item.desc && <div className="chatting-top-header__help-content-item-desc">{item.desc}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="chatting-top-header__token">
          {isMessageLimitsLoading ? (
            <Skelton className="chatting-top-header__token-skelton" />
          ) : (
            <>
              <div className="chatting-top-header__token-count">{allMessageLimits.token}</div>
              <div className="chatting-top-header__token-text">Token</div>
            </>
          )}
        </div>
      </div>
      <div className="chatting-top-header__title">
        <img className="chatting-top-header__ai-image" alt="ai image" src={AIImage} />
        <div className="chatting-top-header__text">
          CHAT
          <div className="chatting-top-header__beta">BETA</div>
        </div>
      </div>
    </div>
  )
}

export default ChattingAITopHeader
