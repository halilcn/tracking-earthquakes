import { configureStore } from '@reduxjs/toolkit'

import app from './app'
import auth from './auth'
import earthquake from './earthquake'
import message from './message'

export default options =>
  configureStore({
    reducer: {
      earthquake,
      auth,
      message,
      app,
    },
    ...options,
  })
