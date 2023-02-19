import { configureStore } from '@reduxjs/toolkit'
import earthquake from './earthquake'
import user from './user'

export default configureStore({
  reducer: {
    earthquake,
    user,
  },
})
