import { configureStore } from '@reduxjs/toolkit'

import auth from './auth'
import earthquake from './earthquake'
import user from './user'

export default options =>
  configureStore({
    reducer: {
      earthquake,
      user,
      auth,
    },
    ...options,
  })
