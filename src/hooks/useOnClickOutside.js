import { useEffect } from 'react'

const useOnClickOutside = (ref, fn) => {
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      fn()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])
}

export default useOnClickOutside
