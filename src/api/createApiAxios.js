import axios from 'axios'

import { API } from '../constants'
import { getUserToken } from '../utils/localStorageActions'

const createApiAxios = () => {
  const apiAxios = axios.create({
    baseURL: API.BACKEND_V1,
  })

  apiAxios.interceptors.request.use(config => {
    const userToken = getUserToken() || ''
    if (userToken) {
      config.headers.Token = userToken
    }

    return config
  })

  return apiAxios
}

export default createApiAxios
