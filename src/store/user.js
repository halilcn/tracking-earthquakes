import { createSlice } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {
    auth: null,
    isLoadedAuthInformation: false,
  },
  reducers: {
    setAuth: (state, actions) => {
      state.auth = actions.payload
    },
    setIsLoadedAuthInformation: (state, actions) => {
      state.isLoadedAuthInformation = actions.payload || !state.isLoadedAuthInformation
    },
  },
})

export const userActions = user.actions
export default user.reducer
