import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'
import { useSelector } from 'react-redux'

import constantsTestid from '../../../../constants/testid'
import './index.scss'

const LoadingData = () => {
  const testid = constantsTestid.loadingData
  const isLoadingData = useSelector(state => state.earthquake.isLoadingData)

  return (
    isLoadingData && (
      <div data-testid={testid.container} className="loading-data">
        <CircularProgress size={30} />
      </div>
    )
  )
}

export default LoadingData
