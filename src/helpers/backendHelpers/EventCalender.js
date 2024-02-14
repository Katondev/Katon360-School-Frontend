import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAllEventCalender = () => {
  return get(`${url.EVENTCALENDER}/get`, getApiConfig())
}

export const getEventCalender = id => {
  return get(`${url.EVENTCALENDER}/${id}`, getApiConfig())
}

export const createEventCalender = data => {
  return post(url.EVENTCALENDER, data, getApiConfig(true))
}

export const updateEventCalender = (id, data) => {
  return put(`${url.EVENTCALENDER}/${id}`, data, getApiConfig(true))
}

export const deleteTeacher = id => {
  return del(`${url.EVENTCALENDER}/${id}`, getApiConfig())
}
export const deleteEventCalender = id => {
  return del(`${url.EVENTCALENDER}/${id}`, getApiConfig())
}
