import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllNotification = () => {
  return get(`${url.NOTIFICATION}/get`, getApiConfig())
}

export const getNotification = id => {
  return get(`${url.NOTIFICATION}/${id}`, getApiConfig())
}

export const createNotification = data => {
  return post(url.NOTIFICATION, data, getApiConfig(true))
}

export const updateNotification = (id, data) => {
  return put(`${url.NOTIFICATION}/${id}`, data, getApiConfig(true))
}

export const deleteTeacher = id => {
  return del(`${url.EVENTCALENDER}/${id}`, getApiConfig())
}
export const deleteNotification = id => {
  return del(`${url.NOTIFICATION}/${id}`, getApiConfig())
}
