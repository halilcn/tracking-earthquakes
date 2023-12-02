import { useEffect, useRef, useState } from 'react'

const loadingCharacter = '.'

const ChattingAiLoadingMessageContent = () => {
  const [loadingText, setLoadingText] = useState('')

  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLoadingText(prev => `${prev.length % 3 !== 0 ? prev : ''}${loadingCharacter}`)
    }, 300)

    return () => clearInterval(intervalRef.current)
  }, [])

  return loadingText
}

export default ChattingAiLoadingMessageContent
