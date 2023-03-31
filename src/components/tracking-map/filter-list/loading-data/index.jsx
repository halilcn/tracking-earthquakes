import CircularProgress from '@mui/material/CircularProgress'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import './index.scss'

const LoadingData = () => {
  const isLoadingData = useSelector(state => state.earthquake.isLoadingData)

  return <div className="loading-data">{isLoadingData && <CircularProgress size={30} />}</div>
}

export default LoadingData
