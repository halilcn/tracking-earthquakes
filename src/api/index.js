import axios from 'axios'
import { addDoc, collection, getDocs } from 'firebase/firestore'

import { API, FIREBASE_CUSTOM_POINTS_DB_NAME } from '../constants'
import { db } from '../service/firebase'
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

export const postCustomPoint = async data => {
  await addDoc(collection(db, FIREBASE_CUSTOM_POINTS_DB_NAME), {
    data: JSON.stringify(data),
  })
}

export const getCustomPoints = async () =>
  await getDocs(collection(db, FIREBASE_CUSTOM_POINTS_DB_NAME)).then(querySnapshot =>
    querySnapshot.docs.map(doc => JSON.parse(doc.data().data))
  )

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
