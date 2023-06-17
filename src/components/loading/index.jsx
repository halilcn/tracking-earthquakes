import { CircularProgress } from '@mui/material'
import React from 'react'

import constantsTestid from '../../constants/testid'
import './index.scss'

const Loading = () => {
  const testid = constantsTestid.loading

  return (
    <div data-testid={testid.loadingContainer} className="laoding">
      <CircularProgress color="grey" size={60} />
    </div>
  )
}

export default Loading
