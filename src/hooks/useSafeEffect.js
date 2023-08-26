import { useEffect, useRef } from 'react'

const useSafeEffect = (func, depends) => {
  const isMounted = useRef(null)

  useEffect(() => {
    if (isMounted.current) return

    isMounted.current = true
    func()
  }, depends)
}

export default useSafeEffect
