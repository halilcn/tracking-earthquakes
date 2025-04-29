import { CircularProgress } from '@mui/material'
import React from 'react'

import LogoBlack from '../../../../public/logo_black.svg'
import './index.scss'

const AppLoading = () => {
  return (
    <div className="laoding">
      <img className="laoding__logo" src={LogoBlack} alt="logo" />
      <CircularProgress color="grey" size={45} />
    </div>
  )
}

export default AppLoading
