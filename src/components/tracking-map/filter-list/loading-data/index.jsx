import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'

import './index.scss'

const LoadingData = () => {
  const isLoading = useSelector(state => state.earthquake.isLoading)

  return <div className="loading-data">{!isLoading && <CircularProgress size={30} />}</div>
}

export default LoadingData
