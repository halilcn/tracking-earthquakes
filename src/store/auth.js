import { createSlice } from '@reduxjs/toolkit'

import { getUserToken } from '../utils/localStorageActions'

export const auth = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userToken: getUserToken() || null,
  },
  reducers: {
    setUser: (state, actions) => {
      state.user = actions.payload
    },
    setUserToken: (state, actions) => {
      state.userToken = actions.payload
    },
    removeUserToken: state => {
      state.userToken = null
    },
  },
})

export const isLoggedInSelector = state => !!state.auth.userToken

export const authActions = auth.actions
export default auth.reducer
