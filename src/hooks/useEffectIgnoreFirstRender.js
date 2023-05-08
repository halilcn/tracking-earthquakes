import { useEffect, useRef } from 'react'

const useEffectIgnoreFirstRender = (callback, dependencies) => {
  const firstRender = useRef(false)
  
  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true
      return
    }

    callback()
  }, dependencies)
}

export default useEffectIgnoreFirstRender
