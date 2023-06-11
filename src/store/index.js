import { configureStore } from '@reduxjs/toolkit'

import earthquake, { initialState } from './earthquake'
import user from './user'

export default (options) =>
  configureStore({
    reducer: {
      earthquake,
      user,
    },
    ...options,
  })
