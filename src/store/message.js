import { createSlice } from '@reduxjs/toolkit'

export const message = createSlice({
  name: 'message',
  initialState: {
    allMessages: [],
    allMessageLimits: {},
  },
  reducers: {
    setAllMessages: (state, actions) => {
      state.allMessages = actions.payload
    },
    addMessage: (state, actions) => {
      state.allMessages = [...state.allMessages, actions.payload]
    },
    setAllMessageLimits: (state, action) => {
      state.allMessageLimits = action.payload
    },
    updateMessageTokenLimit: (state, action) => {
      state.allMessageLimits.token = state.allMessageLimits.token - action.payload
    },
    deleteLastUserOwnerMessage: state => {
      const newAllMessages = [...state.allMessages]
      newAllMessages.pop()

      state.allMessages = newAllMessages
    },
  },
})

export const messageActions = message.actions
export default message.reducer
