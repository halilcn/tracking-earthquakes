import axios from 'axios'
import { KANDILLI_EARTHQUAKES_API_BASE_URL, USGS_EARTHQUAKES_API_BASE_URL, FIREBASE_CUSTOM_POINTS_DB_NAME } from '../constants'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../service/firebase'

export const getEarthquakesInTurkey = async params => {
  const { data } = await axios.get(`${KANDILLI_EARTHQUAKES_API_BASE_URL}/kandilli/archive`, {
    params: {
      limit: 1000, // API provides max 1000 limit
      ...params,
    },
  })
  return data
}

export const getEarthquakesInWorld = async params => {
  const { data } = await axios.get(USGS_EARTHQUAKES_API_BASE_URL, {
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
