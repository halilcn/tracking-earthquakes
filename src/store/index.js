import { configureStore } from '@reduxjs/toolkit'

import earthquake from './earthquake'
import user from './user'

export default (...options) =>
  configureStore({
    reducer: {
      earthquake,
      user,
    },
    ...options,
  })
