import { useEffect, useState } from 'react'

const useCurrentPosition = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lang: 0 })
  const [isAllowed, setIsAllowed] = useState(true)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setCurrentPosition({ lat: position.coords.latitude, lang: position.coords.longitude })
      },
      () => {
        setIsAllowed(false)
      }
    )
  }, [])

  return {
    currentPosition,
    isAllowed,
  }
}

export default useCurrentPosition
