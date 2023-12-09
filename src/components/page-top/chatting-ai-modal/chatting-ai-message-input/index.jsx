import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaInfoCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import { postAIEarthquakeMessage, postAIMessage } from '../../../../api'
import { MESSAGE_OWNER_TYPES, SOURCES } from '../../../../constants'
import { getAllEarthquakes } from '../../../../service/earthquakes'
import { messageActions } from '../../../../store/message'
import { convertDateFormatForAPI } from '../../../../utils'
import dayjs from '../../../../utils/dayjs'
import './index.scss'

// TODO: general error handler
const ChattingAIMessageInput = props => {
  const { isAnswering, setIsAnswering } = props

  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const allMessageLimits = useSelector(state => state.message.allMessageLimits)

  const isTokenNumber = typeof allMessageLimits.token === 'number'
  const hasEnoughLimit = isTokenNumber && allMessageLimits.token > 0
  const isDisabled = message === '' || (!hasEnoughLimit && isTokenNumber)

  const handleOnFocusMessageInput = () => {
    setIsFocused(true)
  }

  const handleOnBlurMessageInput = () => {
    setIsFocused(false)
  }

  const handleChangeMessageInput = e => {
    setMessage(e.target.value)
  }

  const handleOnKeyUpMessageInput = async e => {
    if (e.key === 'Enter') {
      await handlePostAIMessage()
    }
  }

  const handlePastEarthquakeQuestion = async resData => {
    const { functionCall, createdUserMessage } = resData
    const { date } = JSON.parse(functionCall.arguments)

    const selectedDate = dayjs(date, 'DD/MM/YYYY')
    const payload = {
      startDate: convertDateFormatForAPI(selectedDate),
      endDate: convertDateFormatForAPI(selectedDate.add(1, 'day')),
    }

    const allEarthquakes = (await getAllEarthquakes(payload))
      .filter(earthquake => {
        const isSameData = selectedDate.isSame(earthquake.properties.date, 'day')
        const isAvailableMag = Number(earthquake.properties.mag) > 2

        return isSameData && isAvailableMag
      })
      .map(({ properties }) => {
        const { mag, title, coordinates, date } = properties

        return { coordinates, date, mag, location: title }
      })

    const answer = (
      await postAIEarthquakeMessage({
        userMessageId: createdUserMessage._id,
        earthquakes: allEarthquakes,
      })
    ).data

    dispatch(messageActions.addMessage(answer.message))
    dispatch(messageActions.updateMessageTokenLimit(answer.totalPromptUsage))
  }

  const handleTriggerFunctions = async resData => {
    switch (resData.functionCall.name) {
      case 'handlePastEarthquakeQuestion':
        await handlePastEarthquakeQuestion(resData)
        break
    }
  }

  const handleUpdateTokenLimit = messageToken => {
    dispatch(messageActions.updateMessageTokenLimit(messageToken))
  }

  const handleMessageActionsByResponse = async resData => {
    if (!!resData?.functionCall) {
      await handleTriggerFunctions(resData)
      return
    }

    const message = resData?.message
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

      const resData = (
        await postAIMessage({
          content: message,
        })
      ).data

      handleUpdateTokenLimit(resData.totalPromptUsage)
      await handleMessageActionsByResponse(resData)
    } catch (err) {
      const errorMessage = err.response?.data?.message

      if (errorMessage === 'An error occurred while creating user message') {
        dispatch(messageActions.deleteLastUserOwnerMessage())
      }

      alert(errorMessage || t('Occurred a problem'))
    } finally {
      setIsAnswering(false)
    }
  }

  const handleOnClickSendButton = async () => {
    await handlePostAIMessage()
  }

  return (
    <div className="chatting-message-input">
      {!hasEnoughLimit && isTokenNumber && (
        <div className="chatting-message-input__no-limit">
          <FaInfoCircle />
          <div className="chatting-message-input__no-limit-text">{t("You don't have enough limit")}</div>
        </div>
      )}
      <div className={`chatting-message-input__input-container ${isFocused ? 'chatting-message-input__input-container--focused' : ''}`}>
        <input
          onFocus={handleOnFocusMessageInput}
          onBlur={handleOnBlurMessageInput}
          onChange={handleChangeMessageInput}
          onKeyUp={handleOnKeyUpMessageInput}
          value={message}
          placeholder={t('Type a question')}
          className="chatting-message-input__type-text"
          type="text"
        />
        <div
          onClick={handleOnClickSendButton}
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
