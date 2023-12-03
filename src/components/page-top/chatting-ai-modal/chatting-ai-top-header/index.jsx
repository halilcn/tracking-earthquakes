import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AIImage from '../../../../../public/ai.png'
import { getMessageLimits } from '../../../../api'
import { messageActions } from '../../../../store/message'
import Skelton from '../../../skeleton'
import './index.scss'

const ChattingAITopHeader = () => {
  const [isMessageLimitsLoading, setIsMessageLimitsLoading] = useState(false)

  const dispatch = useDispatch()
  const allMessageLimits = useSelector(state => state.message.allMessageLimits)

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

  return (
    <div className="chatting-top-header">
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
      <div className="chatting-top-header__title">
        <img className="chatting-top-header__ai-image" alt="ai image" src={AIImage} />
        <div className="chatting-top-header__text">CHAT</div>
      </div>
    </div>
  )
}

export default ChattingAITopHeader
