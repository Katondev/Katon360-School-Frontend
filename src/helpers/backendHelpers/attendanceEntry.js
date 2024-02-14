import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../urlHelper"

export const getAttendanceEntry = id => {
  return get(`${url.ATTENDANCEENTRY}/${id}`, getApiConfig())
}

export const createAttendanceEntry = data => {
  return post(url.ATTENDANCEENTRY, data, getApiConfig(true))
}

export const updateAttendanceEntry = (data, id) => {
  return put(`${url.ATTENDANCEENTRY}/${id}`, data, getApiConfig(true))
}
