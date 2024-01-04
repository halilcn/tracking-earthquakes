import { configureStore } from '@reduxjs/toolkit'

import auth from './auth'
import earthquake from './earthquake'
import message from './message'

export default options =>
  configureStore({
    reducer: {
      earthquake,
      auth,
      message,
    },
    ...options,
  })
