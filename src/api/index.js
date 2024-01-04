import axios from 'axios'

import { API } from '../constants'
import createApiAxios from './createApiAxios'

const apiAxios = createApiAxios()

export const getEarthquakesInTurkey = async params => {
  const { data } = await axios.get(`${API.KANDILLI}/kandilli/archive`, {
    params: {
      limit: 1000, // API provides max 1000 limit
      ...params,
    },
  })
  return data
}

export const getEarthquakesInWorld = async params => {
  const { data } = await axios.get(API.USGS, {
    params: {
      minmagnitude: 1,
      ...params,
    },
  })
  return data
}

export const postLogin = async credential => {
  const { data } = await apiAxios.post('/users/auth', { credential })
  return data
}

export const postLogout = async () => {
  await apiAxios.post('/users/logout')
}

export const getMe = async () => {
  const { data } = await apiAxios.get('/users/me')
  return data
}

export const getAllMessages = async () => {
  const { data } = await apiAxios.get('/messages')
  return data
}

export const postAIMessage = async payload => {
  const { data } = await apiAxios.post('/messages/ai', payload)
  return data
}

export const getMessageLimits = async () => {
  const { data } = await apiAxios.get('/message-limits')
  return data
}

export const postAIEarthquakeMessage = async payload => {
  const { data } = await apiAxios.post('/messages/ai-earthquake', payload)
  return data
}
