import axios from "axios"
import { API_URL_ADMIN_AREA } from "./urlHelper"

const axiosApi = axios.create({
  baseURL: API_URL_ADMIN_AREA,
})

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export const get = async (url, config = {}) => {
  return axiosApi.get(url, { ...config }).then(response => response.data)
}

export const post = async (url, data, config = {}) => {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export const put = async (url, data, config = {}) => {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export const del = async (url, config = {}) => {
  return axiosApi.delete(url, { ...config }).then(response => response.data)
}
