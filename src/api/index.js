import axios from 'axios'
import { KANDILLI_EARTHQUAKES_API_BASE_URL, USGS_EARTHQUAKES_API_BASE_URL, FIREBASE_CUSTOM_POINTS_DB_NAME } from '../constants'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../service/firebase'
import dayjs from 'dayjs'

export const getEarthquakesInTurkey = async () => {
  const { data } = await axios.get(`${KANDILLI_EARTHQUAKES_API_BASE_URL}/live.php`)
  return data
}

export const getArchiveEarthquakesInTurkey = async params => {
  const { data } = await axios.get(`${DARPHANE_EARTHQUAKES_API_BASE_URL}/kandilli/archive`, {
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
      starttime: dayjs().add(-1, 'day').format('YYYY-MM-DD'),
      endtime: dayjs().format('YYYY-MM-DD'),
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
