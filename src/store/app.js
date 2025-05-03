import { createSlice } from '@reduxjs/toolkit'

import { getCollapsedTopHeader } from '../utils/localStorageActions'

export const initialState = {
  isCollapsedTopHeader: getCollapsedTopHeader() === 'true',
}

export const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateIsCollapsedTopHeader: (state, actions) => {
      state.isCollapsedTopHeader = actions.payload
    },
  },
})

export const appActions = app.actions
export default app.reducer
