import { createSlice } from '@reduxjs/toolkit'

export const message = createSlice({
  name: 'message',
  initialState: {
    allMessages: [],
  },
  reducers: {
    setAllMessages: (state, actions) => {
      state.allMessages = actions.payload
    },
    addMessage: (state, actions) => {
      state.allMessages = [...state.allMessages, actions.payload]
    },
  },
})

export const messageActions = message.actions
export default message.reducer
